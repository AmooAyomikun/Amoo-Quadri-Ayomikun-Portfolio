import tls from 'node:tls'
import { ContactSubmission } from '../repositories/contactRepository.js'
import { Subscriber } from '../repositories/subscriberRepository.js'
import { NewsItem } from '../data/newsData.js'

/**
 * HTML-escapes sensitive characters to prevent HTML injection and email spoofing.
 */
export function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Zero-dependency Gmail SMTPS sender over smtp.gmail.com:465 using a Google App Password.
 */
function sendViaGmailSmtps(options: {
  gmailUser: string
  gmailAppPassword: string
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  return new Promise((resolve) => {
    const cleanPass = options.gmailAppPassword.replace(/\s+/g, '')
    const fromUser = options.gmailUser.trim()
    const recipient = options.to.trim()

    const socket = tls.connect(
      {
        host: 'smtp.gmail.com',
        port: 465,
        servername: 'smtp.gmail.com',
        timeout: 12000
      },
      () => {
        // Connected over TLS; wait for 220 banner
      }
    )

    let step = 0
    let buffer = ''
    let finished = false

    const finish = (ok: boolean) => {
      if (finished) return
      finished = true
      try {
        socket.end()
      } catch {
        // ignore
      }
      resolve(ok)
    }

    const sendLine = (line: string) => {
      socket.write(`${line}\r\n`)
    }

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8')
      const lines = buffer.split('\r\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line || (line.length >= 4 && line[3] === '-')) continue
        const code = parseInt(line.slice(0, 3), 10)

        if (step === 0 && code === 220) {
          step = 1
          sendLine('EHLO portfolio.local')
        } else if (step === 1 && code === 250) {
          step = 2
          sendLine('AUTH LOGIN')
        } else if (step === 2 && code === 334) {
          step = 3
          sendLine(Buffer.from(fromUser, 'utf8').toString('base64'))
        } else if (step === 3 && code === 334) {
          step = 4
          sendLine(Buffer.from(cleanPass, 'utf8').toString('base64'))
        } else if (step === 4 && code === 235) {
          step = 5
          sendLine(`MAIL FROM:<${fromUser}>`)
        } else if (step === 5 && code === 250) {
          step = 6
          sendLine(`RCPT TO:<${recipient}>`)
        } else if (step === 6 && (code === 250 || code === 251)) {
          step = 7
          sendLine('DATA')
        } else if (step === 7 && code === 354) {
          step = 8
          const safeSubject = options.subject.replace(/[\r\n]+/g, ' ').trim()
          const encodedSubject = `=?UTF-8?B?${Buffer.from(safeSubject, 'utf8').toString('base64')}?=`
          const htmlBase64 =
            Buffer.from(options.html, 'utf8')
              .toString('base64')
              .match(/.{1,76}/g)
              ?.join('\r\n') || ''

          const mimeMessage = [
            `From: "Quadri Ayomikun Amoo" <${fromUser}>`,
            `To: <${recipient}>`,
            `Subject: ${encodedSubject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            htmlBase64,
            '.'
          ].join('\r\n')

          sendLine(mimeMessage)
        } else if (step === 8 && code === 250) {
          step = 9
          sendLine('QUIT')
          finish(true)
        } else if (code >= 400) {
          console.warn(`[EmailService] Gmail SMTP error at step ${step}:`, line)
          finish(false)
        }
      }
    })

    socket.on('timeout', () => {
      console.warn('[EmailService] Gmail SMTP connection timed out.')
      finish(false)
    })

    socket.on('error', (err) => {
      console.warn('[EmailService] Gmail SMTP socket error:', err.message)
      finish(false)
    })
  })
}

export class EmailService {
  /**
   * Unified email dispatcher supporting:
   * 1. Direct Gmail Apps Script HTTPS Webhook (GMAIL_WEBHOOK_URL) — 100% free, no custom domain, works on Render free tier
   * 2. Direct Gmail SMTPS via App Password (GMAIL_APP_PASSWORD + GMAIL_USER) — 100% free, sends from amooquadri555@gmail.com
   * 3. Resend API (RESEND_API_KEY) — fallback
   */
  private async dispatchEmail(params: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    const gmailWebhookUrl = process.env.GMAIL_WEBHOOK_URL?.trim()
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim()
    const gmailUser = (process.env.GMAIL_USER || process.env.ADMIN_NOTIFY_EMAIL || 'amooquadri555@gmail.com').trim()
    const resendApiKey = process.env.RESEND_API_KEY?.trim()

    // 1. Try Gmail Apps Script HTTPS Webhook first if configured (never blocked by Render firewall)
    if (gmailWebhookUrl) {
      try {
        const res = await fetch(gmailWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: params.to,
            subject: params.subject,
            html: params.html
          })
        })
        if (res.ok) {
          console.log(`[EmailService] Sent email to ${params.to} via Gmail Webhook`)
          return true
        }
      } catch (err) {
        console.warn('[EmailService] Gmail Webhook failed, falling back:', err)
      }
    }

    // 2. Try Direct Gmail SMTPS (GMAIL_APP_PASSWORD)
    if (gmailAppPassword) {
      const sent = await sendViaGmailSmtps({
        gmailUser,
        gmailAppPassword,
        to: params.to,
        subject: params.subject,
        html: params.html
      })
      if (sent) {
        console.log(`[EmailService] Sent email to ${params.to} via Gmail SMTPS (${gmailUser})`)
        return true
      }
    }

    // 3. Try Resend API fallback
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Quadri Ayomikun Amoo <onboarding@resend.dev>',
            to: [params.to],
            subject: params.subject,
            html: params.html
          })
        })

        if (response.ok) {
          console.log(`[EmailService] Sent email to ${params.to} via Resend`)
          return true
        } else {
          const errText = await response.text()
          console.warn(`[EmailService] Resend API error (${response.status}):`, errText)
        }
      } catch (err) {
        console.warn('[EmailService] Failed to dispatch email via Resend:', err)
      }
    }

    return false
  }

  async notifyNewContactMessage(submission: ContactSubmission): Promise<boolean> {
    const safeName = escapeHtml(submission.name || '')
    const safeEmail = escapeHtml(submission.email || '')
    const safeLens = escapeHtml(submission.lens || 'general')
    const safeTimestamp = escapeHtml(submission.timestamp || '')
    const safeSubject = (submission.subject || 'New Contact Message').replace(/[\r\n]+/g, ' ').trim()
    const safeMessage = escapeHtml(submission.message || '').replace(/\n/g, '<br/>')
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'amooquadri555@gmail.com'

    const sent = await this.dispatchEmail({
      to: adminEmail,
      subject: `[Portfolio Inquiry] ${safeSubject} from ${safeName.replace(/[\r\n]+/g, ' ')}`,
      html: `
        <h2>New Contact Submission Received</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Lens:</strong> ${safeLens}</p>
        <p><strong>Received At:</strong> ${safeTimestamp}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #d4a359;">
          ${safeMessage}
        </blockquote>
      `
    })

    if (!sent) {
      console.log(`[EmailService] Message ${submission.id} received and available on Admin Portal.`)
    }
    return sent
  }

  async sendSubscriptionWelcomeEmail(subscriber: Subscriber): Promise<boolean> {
    const frontendUrl = (process.env.FRONTEND_URL || 'https://amoo-quadri-ayomikun-portfolio-fron.vercel.app').replace(/\/$/, '')
    const backendUrl = (process.env.BACKEND_URL || 'https://amoo-quadri-ayomikun-portfolio.onrender.com').replace(/\/$/, '')
    const unsubscribeUrl = `${backendUrl}/api/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`
    const safeEmail = escapeHtml(subscriber.email)
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'amooquadri555@gmail.com'

    // 1. Send welcome email directly to the subscriber's Gmail
    const sentToSubscriber = await this.dispatchEmail({
      to: subscriber.email,
      subject: "Welcome to Quadri Ayomikun Amoo's Research & Engineering Dispatches",
      html: `
        <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;padding:28px;background:#111110;color:#edeae4;border-radius:16px;border:1px solid #2a2926;">
          <p style="font-family:monospace;font-size:11px;letter-spacing:2px;color:#d4a359;text-transform:uppercase;margin:0 0 8px;">// SUBSCRIPTION CONFIRMED</p>
          <h2 style="margin:0 0 16px;font-size:22px;color:#edeae4;">Thank you for subscribing</h2>
          <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#a19d95;">
            Your email (<strong style="color:#edeae4;">${safeEmail}</strong>) is now subscribed to receive updates whenever new peer-reviewed research, technical articles, or software engineering milestones are published.
          </p>
          <div style="margin:24px 0;">
            <a href="${frontendUrl}/news" style="display:inline-block;padding:10px 20px;background:#d4a359;color:#111110;text-decoration:none;font-family:monospace;font-weight:bold;font-size:12px;border-radius:8px;">
              Explore Latest Dispatches
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #2a2926;margin:24px 0;" />
          <p style="font-family:monospace;font-size:11px;color:#6e6a63;">
            You can <a href="${unsubscribeUrl}" style="color:#d4a359;">unsubscribe with one click</a> at any time.
          </p>
        </div>
      `
    })

    // 2. Notify Admin (amooquadri555@gmail.com)
    await this.dispatchEmail({
      to: adminEmail,
      subject: `[New Subscriber] ${subscriber.email} joined your mailing list`,
      html: `
        <h3>New Newsletter Subscriber</h3>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subscribed At:</strong> ${escapeHtml(subscriber.subscribedAt)}</p>
      `
    })

    return sentToSubscriber
  }

  async notifySubscribersNewArticle(article: NewsItem, subscribers: Subscriber[]): Promise<number> {
    const activeSubscribers = subscribers.filter((s) => s.status === 'active')
    if (activeSubscribers.length === 0) return 0

    const frontendUrl = (process.env.FRONTEND_URL || 'https://amoo-quadri-ayomikun-portfolio-fron.vercel.app').replace(/\/$/, '')
    const backendUrl = (process.env.BACKEND_URL || 'https://amoo-quadri-ayomikun-portfolio.onrender.com').replace(/\/$/, '')
    const articleUrl = `${frontendUrl}/news/${encodeURIComponent(article.id)}`
    const safeTitle = escapeHtml(article.title)
    const safeSummary = escapeHtml(article.summary)
    const safeCategory = escapeHtml(article.category)

    let sentCount = 0
    for (const sub of activeSubscribers) {
      const unsubscribeUrl = `${backendUrl}/api/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`
      const ok = await this.dispatchEmail({
        to: sub.email,
        subject: `[New ${safeCategory}] ${article.title}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;padding:28px;background:#111110;color:#edeae4;border-radius:16px;border:1px solid #2a2926;">
            <p style="font-family:monospace;font-size:11px;letter-spacing:2px;color:#d4a359;text-transform:uppercase;margin:0 0 8px;">// NEW ${safeCategory.toUpperCase()} DISPATCH</p>
            <h2 style="margin:0 0 12px;font-size:22px;color:#edeae4;">${safeTitle}</h2>
            <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#a19d95;">
              ${safeSummary}
            </p>
            <div style="margin:24px 0;">
              <a href="${articleUrl}" style="display:inline-block;padding:10px 20px;background:#d4a359;color:#111110;text-decoration:none;font-family:monospace;font-weight:bold;font-size:12px;border-radius:8px;">
                Read Full Article
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #2a2926;margin:24px 0;" />
            <p style="font-family:monospace;font-size:11px;color:#6e6a63;">
              You received this because you subscribed to updates from Quadri Ayomikun Amoo. <a href="${unsubscribeUrl}" style="color:#d4a359;">Unsubscribe</a>.
            </p>
          </div>
        `
      })
      if (ok) sentCount++
    }
    return sentCount
  }
}

export const emailService = new EmailService()
