import { Request, Response } from 'express'
import { newsService } from '../services/newsService.js'
import { subscriberService } from '../services/subscriberService.js'
import { emailService } from '../services/emailService.js'

export const getNews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const articles = await newsService.getAllNews()
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    })
  } catch (error) {
    console.error('[NewsController] Get news error:', error)
    res.status(500).json({ success: false, error: 'Internal server error retrieving news articles' })
  }
}

export const publishNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, summary, content, tags, externalUrl } = req.body ?? {}
    const newArticle = await newsService.publishArticle({
      title,
      category,
      summary,
      content,
      tags,
      externalUrl
    })

    // Asynchronously email all active subscribers about the new dispatch
    subscriberService.getAll()
      .then((subs) => emailService.notifySubscribersNewArticle(newArticle, subs))
      .catch((err) => console.warn('[NewsController] Subscriber broadcast error:', err))

    console.log('[NewsController] News published:', newArticle.id)
    res.status(201).json({
      success: true,
      message: 'News announcement published successfully!',
      data: newArticle
    })
  } catch (error) {
    console.error('[NewsController] Publish news error:', error)
    res.status(500).json({ success: false, error: 'Internal server error publishing news announcement' })
  }
}

export const deleteNewsArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) {
      res.status(400).json({ success: false, error: 'Article ID is required' })
      return
    }

    await newsService.deleteArticle(id)
    res.status(200).json({ success: true, message: 'Article deleted successfully' })
  } catch (error) {
    console.error('[NewsController] Delete news error:', error)
    res.status(500).json({ success: false, error: 'Internal server error deleting news article' })
  }
}
