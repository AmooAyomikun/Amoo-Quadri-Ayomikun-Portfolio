import { Request, Response } from 'express'

export interface ContactSubmission {
  name: string
  email: string
  subject?: string
  message: string
  lens?: 'research' | 'industry' | 'general'
}

export const submitContact = (req: Request, res: Response): void => {
  const { name, email, subject, message, lens } = req.body as Partial<ContactSubmission>

  if (!name || !email || !message) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, and message are required.'
    })
    return
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    })
    return
  }

  // Log message internally (could be saved to DB or emailed via nodemailer/resend)
  console.log('[Contact API Submission]', {
    timestamp: new Date().toISOString(),
    name,
    email,
    subject: subject || 'Portfolio Contact Form Inquiry',
    lens: lens || 'general',
    message
  })

  res.status(200).json({
    success: true,
    message: 'Thank you for reaching out! Your message has been sent successfully.',
    details: {
      receivedAt: new Date().toISOString(),
      sender: name,
      email
    }
  })
}
