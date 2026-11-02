import { ContactSubmission } from '../repositories/contactRepository.js'

export class EmailService {
  async notifyNewContactMessage(submission: ContactSubmission): Promise<boolean> {
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
            to: [process.env.ADMIN_NOTIFY_EMAIL || 'amooquadri555@gmail.com'],
            subject: `[Portfolio Inquiry] ${submission.subject || 'New Contact Message'} from ${submission.name}`,
            html: `
              <h2>New Contact Submission Received</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> ${submission.email}</p>
              <p><strong>Lens:</strong> ${submission.lens || 'general'}</p>
              <p><strong>Received At:</strong> ${submission.timestamp}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #00c6ff;">
                ${submission.message.replace(/\n/g, '<br/>')}
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
