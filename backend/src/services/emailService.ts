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

export class EmailService {
  async notifyNewContactMessage(submission: ContactSubmission): Promise<boolean> {
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        const safeName = escapeHtml(submission.name || '')
        const safeEmail = escapeHtml(submission.email || '')
        const safeLens = escapeHtml(submission.lens || 'general')
        const safeTimestamp = escapeHtml(submission.timestamp || '')
        const safeSubject = (submission.subject || 'New Contact Message').replace(/[\r\n]+/g, ' ').trim()
        const safeMessage = escapeHtml(submission.message || '').replace(/\n/g, '<br/>')

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
            to: [process.env.ADMIN_NOTIFY_EMAIL || 'amooquadri555@gmail.com'],
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
        })

        if (response.ok) {
          console.log(`[EmailService] Dispatched email alert for message ${submission.id}`)
          return true
        } else {
          const errText = await response.text()
          console.warn(`[EmailService] Resend API error (${response.status}):`, errText)
        }
      } catch (err) {
        console.warn('[EmailService] Failed to dispatch email notification via Resend:', err)
      }
    }

    // Safe fallback if Resend is not configured: message is recorded in database and admin dashboard
    console.log(`[EmailService] Message ${submission.id} received and available on Admin Portal.`)
    return false
  }

  async sendSubscriptionWelcomeEmail(subscriber: Subscriber): Promise<boolean> {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.log(`[EmailService] Subscriber ${subscriber.email} registered (Resend key not configured).`)
      return false
    }

    const frontendUrl = (process.env.FRONTEND_URL || 'https://amoo-quadri-ayomikun-portfolio-fron.vercel.app').replace(/\/$/, '')
    const backendUrl = (process.env.BACKEND_URL || 'https://amoo-quadri-ayomikun-portfolio.onrender.com').replace(/\/$/, '')
    const unsubscribeUrl = `${backendUrl}/api/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`
    const safeEmail = escapeHtml(subscriber.email)

    try {
      // 1. Send welcome email to subscriber
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Quadri Ayomikun Amoo <onboarding@resend.dev>',
          to: [subscriber.email],
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
      })

      // 2. Notify Admin of new subscriber
      const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'amooquadri555@gmail.com'
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Portfolio Subscriptions <onboarding@resend.dev>',
          to: [adminEmail],
          subject: `[New Subscriber] ${subscriber.email} joined your mailing list`,
          html: `
            <h3>New Newsletter Subscriber</h3>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subscribed At:</strong> ${escapeHtml(subscriber.subscribedAt)}</p>
          `
        })
      })

      return true
    } catch (err) {
      console.warn('[EmailService] Failed to send welcome email:', err)
      return false
    }
  }

  async notifySubscribersNewArticle(article: NewsItem, subscribers: Subscriber[]): Promise<number> {
    const resendApiKey = process.env.RESEND_API_KEY
    const activeSubscribers = subscribers.filter(s => s.status === 'active')
    if (!resendApiKey || activeSubscribers.length === 0) {
      return 0
    }

    const frontendUrl = (process.env.FRONTEND_URL || 'https://amoo-quadri-ayomikun-portfolio-fron.vercel.app').replace(/\/$/, '')
    const backendUrl = (process.env.BACKEND_URL || 'https://amoo-quadri-ayomikun-portfolio.onrender.com').replace(/\/$/, '')
    const articleUrl = `${frontendUrl}/news/${encodeURIComponent(article.id)}`
    const safeTitle = escapeHtml(article.title)
    const safeSummary = escapeHtml(article.summary)
    const safeCategory = escapeHtml(article.category)

    let sentCount = 0
    for (const sub of activeSubscribers) {
      const unsubscribeUrl = `${backendUrl}/api/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Quadri Ayomikun Amoo <onboarding@resend.dev>',
            to: [sub.email],
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
        })
        if (res.ok) sentCount++
      } catch (err) {
        console.warn(`[EmailService] Failed to notify subscriber ${sub.email}:`, err)
      }
    }
    return sentCount
  }
}

export const emailService = new EmailService()
