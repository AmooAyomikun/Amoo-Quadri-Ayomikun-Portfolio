import { contactRepository, ContactSubmission, PaginatedResult } from '../repositories/contactRepository.js'
import { emailService } from './emailService.js'

export class ContactService {
  async submitMessage(data: {
    name: string
    email: string
    subject?: string
    message: string
    lens?: 'research' | 'industry' | 'general'
  }): Promise<ContactSubmission> {
    const newMessage: ContactSubmission = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim().slice(0, 80),
      email: data.email.trim().slice(0, 100),
      subject: (data.subject?.trim() || 'Portfolio Contact Inquiry').slice(0, 150),
      message: data.message.trim().slice(0, 3000),
      lens: data.lens || 'general',
      timestamp: new Date().toISOString(),
      read: false
    }

    await contactRepository.save(newMessage)

    // Trigger non-blocking email alert (Issue 3.4)
    emailService.notifyNewContactMessage(newMessage).catch(err => {
      console.warn('[ContactService] Background email alert failed:', err)
    })

    console.log('[ContactService] Submission Saved:', {
      id: newMessage.id,
      lens: newMessage.lens,
      timestamp: newMessage.timestamp
    })

    return newMessage
  }

  async getMessages(options: { limit?: number; cursor?: string } = {}): Promise<PaginatedResult<ContactSubmission>> {
    return contactRepository.getMessages(options)
  }

  async deleteMessage(id: string): Promise<boolean> {
    return contactRepository.delete(id)
  }
}

export const contactService = new ContactService()
