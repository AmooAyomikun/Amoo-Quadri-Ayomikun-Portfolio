import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const subscribersFilePath = path.join(__dirname, '../data/subscribers.json')

interface Subscriber {
  id: string
  email: string
  subscribedAt: string
}

const readSubscribersFromFile = (): Subscriber[] => {
  try {
    if (fs.existsSync(subscribersFilePath)) {
      const raw = fs.readFileSync(subscribersFilePath, 'utf8')
      return JSON.parse(raw) as Subscriber[]
    }
  } catch (err) {
    console.error('Error reading subscribers.json:', err)
  }
  return []
}

const saveSubscribersToFile = (subscribers: Subscriber[]): void => {
  try {
    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving subscribers.json:', err)
  }
}

export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body ?? {}

  if (!email || typeof email !== 'string') {
    res.status(400).json({ success: false, error: 'Email address is required.' })
    return
  }

  const cleanEmail = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
    res.status(400).json({ success: false, error: 'Please enter a valid email address.' })
    return
  }

  const subscribers = readSubscribersFromFile()
  const existing = subscribers.find(s => s.email === cleanEmail)

  if (existing) {
    res.status(200).json({
      success: true,
      message: 'You are already subscribed to Quadri\'s updates!'
    })
    return
  }

  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    subscribedAt: new Date().toISOString()
  }

  subscribers.push(newSub)
  saveSubscribersToFile(subscribers)

  if (db) {
    try {
      await db.collection('subscribers').doc(newSub.id).set(newSub)
    } catch (err) {
      console.error('Firestore save subscriber error:', err)
    }
  }

  console.log('[Newsletter Subscribed]:', cleanEmail)

  res.status(201).json({
    success: true,
    message: 'Subscribed successfully to Quadri\'s research & engineering updates!'
  })
}

export const getSubscribers = async (_req: Request, res: Response): Promise<void> => {
  const subscribers = readSubscribersFromFile()
  res.status(200).json({
    success: true,
    count: subscribers.length,
    data: subscribers
  })
}
