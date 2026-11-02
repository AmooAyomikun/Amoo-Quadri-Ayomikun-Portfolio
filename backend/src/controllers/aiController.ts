import { Request, Response } from 'express'
import { aiService } from '../services/aiService.js'

export const handleAiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' })
      return
    }

    const trimmed = message.trim()
    if (trimmed.length > 500) {
      res.status(400).json({ error: 'Message exceeds maximum length of 500 characters' })
      return
    }

    const reply = await aiService.generateReply(trimmed)
    res.json({ reply })
  } catch (error) {
    console.error('[AIController] Error handling chat:', error)
    res.status(500).json({ error: 'Internal server error in AI Assistant' })
  }
}

export { getSmartPortfolioReply } from '../services/portfolioKnowledgeEngine.js'

