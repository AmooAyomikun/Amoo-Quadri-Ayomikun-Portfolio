import { Request, Response } from 'express'
import { subscriberService } from '../services/subscriberService.js'
import { emailService } from '../services/emailService.js'

export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, consent } = req.body ?? {}
    const result = await subscriberService.subscribe(email, consent !== false)

    if (result.subscriber) {
      emailService.sendSubscriptionWelcomeEmail(result.subscriber).catch((err) => {
        console.warn('[SubscribeController] Welcome email dispatch error:', err)
      })
    }

    res.status(201).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    console.error('[SubscribeController] Subscribe error:', error)
    res.status(500).json({ success: false, error: 'Internal server error processing subscription' })
  }
}

export const unsubscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const target = req.body?.email || req.body?.token || req.query.token || req.query.email
    if (!target || typeof target !== 'string') {
      res.status(400).json({ success: false, error: 'Email or unsubscribe token is required' })
      return
    }

    const success = await subscriberService.unsubscribe(target)
    if (!success) {
      res.status(404).json({ success: false, error: 'Subscription not found or already unsubscribed' })
      return
    }

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed from research and project updates.'
    })
  } catch (error) {
    console.error('[SubscribeController] Unsubscribe error:', error)
    res.status(500).json({ success: false, error: 'Internal server error processing unsubscribe' })
  }
}

export const getSubscribers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await subscriberService.getAll()
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    })
  } catch (error) {
    console.error('[SubscribeController] Get subscribers error:', error)
    res.status(500).json({ success: false, error: 'Internal server error retrieving subscribers' })
  }
}
