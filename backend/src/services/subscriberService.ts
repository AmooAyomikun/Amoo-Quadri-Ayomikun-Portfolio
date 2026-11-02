import crypto from 'crypto'
import { subscriberRepository, Subscriber } from '../repositories/subscriberRepository.js'

export class SubscriberService {
  async subscribe(email: string, consent = true): Promise<{ success: boolean; message: string; subscriber?: Subscriber }> {
    const cleanEmail = email.trim().toLowerCase()
    const existing = await subscriberRepository.findByEmail(cleanEmail)

    if (existing) {
      if (existing.status === 'active') {
        return {
          success: true,
          message: 'You are already subscribed to Quadri\'s research & engineering updates!'
        }
      }
      // Re-activate if previously unsubscribed
      existing.status = 'active'
      existing.unsubscribedAt = undefined
      existing.consent = consent
      existing.consentTimestamp = new Date().toISOString()
      await subscriberRepository.save(existing)
      return {
        success: true,
        message: 'Welcome back! Your subscription to Quadri\'s updates has been re-activated.'
      }
    }

    const unsubscribeToken = crypto.randomBytes(24).toString('hex')
    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      unsubscribeToken,
      consent,
      consentTimestamp: new Date().toISOString()
    }

    await subscriberRepository.save(newSub)
    console.log('[SubscriberService] New active subscriber registered with consent.')

    return {
      success: true,
      message: 'Subscribed successfully to Quadri\'s research & engineering updates! You can unsubscribe anytime.',
      subscriber: newSub
    }
  }

  async unsubscribe(tokenOrEmail: string): Promise<boolean> {
    return subscriberRepository.unsubscribe(tokenOrEmail)
  }

  async getAll(): Promise<Subscriber[]> {
    return subscriberRepository.getAll()
  }
}

export const subscriberService = new SubscriberService()
