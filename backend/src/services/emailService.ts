import { ContactSubmission } from '../repositories/contactRepository.js'

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
              <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #00c6ff;">
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
}

export const emailService = new EmailService()
