import { guestbookRepository, GuestbookEntry, PaginatedGuestbook } from '../repositories/guestbookRepository.js'

export class GuestbookService {
  // Robust profanity detector with leetspeak normalization
  containsProfanity(text: string): boolean {
    if (!text) return false
    const normalized = text
      .toLowerCase()
      .replace(/[0o]/g, 'o')
      .replace(/[1!|]/g, 'i')
      .replace(/[3]/g, 'e')
      .replace(/[@4]/g, 'a')
      .replace(/[$5]/g, 's')
      .replace(/[+]/g, 't')
      .replace(/[^a-z]/g, '')

    const bannedPatterns = [
      /fuck/,
      /shit/,
      /bitch/,
      /asshole/,
      /dick/,
      /pussy/,
      /cunt/,
      /whore/,
      /bastard/,
      /nigger/,
      /nigga/
    ]

    return bannedPatterns.some(pattern => pattern.test(normalized))
  }

  async getSignatures(options: { limit?: number; cursor?: string } = {}): Promise<PaginatedGuestbook> {
    return guestbookRepository.getSignatures(options)
  }

  async addSignature(data: {
    name: string
    message?: string
    signatureData?: string
  }): Promise<{ success: boolean; entry?: GuestbookEntry; error?: string }> {
    const cleanName = data.name.trim()
    const cleanMessage = (data.message || '').trim().slice(0, 500)
    const cleanSignature = data.signatureData || ''

    if (this.containsProfanity(cleanName) || this.containsProfanity(cleanMessage)) {
      return { success: false, error: 'Inappropriate language detected. Please keep guestbook entries respectful.' }
    }

    const newEntry: GuestbookEntry = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      message: cleanMessage,
      signatureData: cleanSignature,
      timestamp: new Date().toISOString()
    }

    await guestbookRepository.save(newEntry)
    return { success: true, entry: newEntry }
  }

  async deleteEntry(id: string): Promise<boolean> {
    return guestbookRepository.delete(id)
  }
}

export const guestbookService = new GuestbookService()
