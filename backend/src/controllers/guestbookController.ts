import { Request, Response } from 'express'
import { guestbookService } from '../services/guestbookService.js'

export const getSignatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined

    const paginated = await guestbookService.getSignatures({ limit, cursor })

    // If client did not specify pagination query params, return array directly for legacy backward-compatibility
    if (!req.query.limit && !req.query.cursor) {
      res.status(200).json(paginated.entries)
      return
    }

    res.status(200).json(paginated)
  } catch (error) {
    console.error('[GuestbookController] Error retrieving signatures:', error)
    res.status(500).json({ error: 'Failed to fetch signatures' })
  }
}

export const addSignature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, message, signatureData } = req.body ?? {}

    // Signature image data URL validation if provided
    if (signatureData) {
      if (typeof signatureData !== 'string') {
        res.status(400).json({ error: 'Invalid signature format.' })
        return
      }
      const isPngDataUrl = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(signatureData)
      if (!isPngDataUrl) {
        res.status(400).json({ error: 'Signature must be a valid PNG image data URL.' })
        return
      }
      if (signatureData.length > 500000) {
        res.status(400).json({ error: 'Signature data is too large (maximum 500KB).' })
        return
      }
    }

    const result = await guestbookService.addSignature({ name, message, signatureData })
    if (!result.success || !result.entry) {
      res.status(400).json({ error: result.error || 'Failed to submit signature' })
      return
    }

    res.status(201).json(result.entry)
  } catch (error) {
    console.error('[GuestbookController] Error adding signature:', error)
    res.status(500).json({ error: 'Failed to add signature' })
  }
}

export const deleteGuestbookEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (!id) {
      res.status(400).json({ error: 'Entry ID is required' })
      return
    }

    await guestbookService.deleteEntry(id)
    res.status(200).json({ success: true, message: 'Guestbook entry deleted successfully.' })
  } catch (error) {
    console.error('[GuestbookController] Error deleting entry:', error)
    res.status(500).json({ error: 'Failed to delete guestbook entry' })
  }
}
