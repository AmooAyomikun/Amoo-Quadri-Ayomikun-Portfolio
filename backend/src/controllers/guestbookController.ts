import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const guestbookFilePath = path.join(__dirname, '../data/guestbook.json')

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

const readGuestbookFromFile = (): GuestbookEntry[] => {
  try {
    if (fs.existsSync(guestbookFilePath)) {
      const raw = fs.readFileSync(guestbookFilePath, 'utf8')
      return JSON.parse(raw) as GuestbookEntry[]
    }
  } catch (err) {
    console.error('Error reading guestbook.json:', err)
  }
  return []
}

const saveGuestbookToFile = (entries: GuestbookEntry[]): void => {
  try {
    fs.writeFileSync(guestbookFilePath, JSON.stringify(entries, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving guestbook.json:', err)
  }
}

// Robust profanity detector with leetspeak normalization
const containsProfanity = (text: string): boolean => {
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

export const getSignatures = async (_req: Request, res: Response): Promise<void> => {
  try {
    let entries = readGuestbookFromFile()

    if (db) {
      try {
        const snapshot = await db.collection('guestbook')
          .orderBy('timestamp', 'desc')
          .get()
          
        if (!snapshot.empty) {
          entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as GuestbookEntry[]
        }
      } catch (err) {
        console.warn('Firestore guestbook fetch failed, using local file storage:', err)
      }
    }

    res.status(200).json(entries)
  } catch (err) {
    console.error('Error reading guestbook:', err)
    res.status(500).json({ error: 'Failed to fetch signatures' })
  }
}

export const addSignature = async (req: Request, res: Response): Promise<void> => {
  const { name, message, signatureData } = req.body ?? {}

  // 1. Name validation
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Name is required.' })
    return
  }

  const cleanName = name.trim()
  if (cleanName.length < 2 || cleanName.length > 60) {
    res.status(400).json({ error: 'Name must be between 2 and 60 characters.' })
    return
  }

  // 2. Message validation
  const cleanMessage = typeof message === 'string' ? message.trim() : ''
  if (cleanMessage.length > 500) {
    res.status(400).json({ error: 'Message cannot exceed 500 characters.' })
    return
  }

  // 3. Signature validation
  let cleanSignature = ''
  if (signatureData) {
    if (typeof signatureData !== 'string') {
      res.status(400).json({ error: 'Invalid signature format.' })
      return
    }
    // Check for PNG data URL
    const isPngDataUrl = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(signatureData)
    if (!isPngDataUrl) {
      res.status(400).json({ error: 'Signature must be a valid PNG image data URL.' })
      return
    }
    if (signatureData.length > 500000) {
      res.status(400).json({ error: 'Signature data is too large (maximum 500KB).' })
      return
    }
    cleanSignature = signatureData
  }

  if (!cleanMessage && !cleanSignature) {
    res.status(400).json({ error: 'Either a message or handwritten signature is required.' })
    return
  }

  // 4. Profanity check
  if (containsProfanity(cleanName) || containsProfanity(cleanMessage)) {
    res.status(400).json({ error: 'Inappropriate language detected. Please keep guestbook entries respectful.' })
    return
  }

  const newEntry: GuestbookEntry = {
    id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    message: cleanMessage,
    signatureData: cleanSignature,
    timestamp: new Date().toISOString()
  }

  const entries = readGuestbookFromFile()
  entries.unshift(newEntry)
  saveGuestbookToFile(entries)

  if (db) {
    try {
      await db.collection('guestbook').doc(newEntry.id).set(newEntry)
    } catch (err) {
      console.warn('Firestore guestbook sync failed, entry safely stored in local file:', err)
    }
  }

  res.status(201).json(newEntry)
}

export const deleteGuestbookEntry = async (req: Request, res: Response): Promise<void> => {
  const rawId = req.params.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  if (!id) {
    res.status(400).json({ error: 'Entry ID is required' })
    return
  }

  const entries = readGuestbookFromFile().filter(e => e.id !== id)
  saveGuestbookToFile(entries)

  if (db) {
    try {
      await db.collection('guestbook').doc(id).delete()
    } catch (err) {
      console.error('Firestore delete guestbook error:', err)
    }
  }

  res.status(200).json({ success: true, message: 'Guestbook entry deleted successfully.' })
}
