import { Request, Response } from 'express'
import { contactService } from '../services/contactService.js'

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message, lens } = req.body ?? {}
    const result = await contactService.submitMessage({ name, email, subject, message, lens })

    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received and saved to Quadri\'s communication portal.',
      details: {
        id: result.id,
        receivedAt: result.timestamp,
        sender: result.name
      }
    })
  } catch (error) {
    console.error('[ContactController] Submit error:', error)
    res.status(500).json({ success: false, error: 'Internal server error processing contact submission' })
  }
}

export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined

    const paginated = await contactService.getMessages({ limit, cursor })
    res.status(200).json({
      success: true,
      ...paginated
    })
  } catch (error) {
    console.error('[ContactController] Get messages error:', error)
    res.status(500).json({ success: false, error: 'Internal server error retrieving contact messages' })
  }
}

export const deleteContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) {
      res.status(400).json({ success: false, error: 'Message ID is required' })
      return
    }

    await contactService.deleteMessage(id)
    res.status(200).json({ success: true, message: 'Message deleted successfully' })
  } catch (error) {
    console.error('[ContactController] Delete message error:', error)
    res.status(500).json({ success: false, error: 'Internal server error deleting contact message' })
  }
}
