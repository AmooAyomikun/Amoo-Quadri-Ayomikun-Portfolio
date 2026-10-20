import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const messagesFilePath = path.join(__dirname, '../data/messages.json')

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  lens?: 'research' | 'industry' | 'general'
  timestamp: string
  read?: boolean
}

const readMessagesFromFile = (): ContactSubmission[] => {
  try {
    if (fs.existsSync(messagesFilePath)) {
      const raw = fs.readFileSync(messagesFilePath, 'utf8')
      return JSON.parse(raw) as ContactSubmission[]
    }
  } catch (err) {
    console.error('Error reading messages.json:', err)
  }
  return []
}

const saveMessagesToFile = (messages: ContactSubmission[]): void => {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving messages.json:', err)
  }
}

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message, lens } = req.body ?? {}

  // Explicit type checks for incoming required fields
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    res.status(400).json({
      success: false,
      error: 'Missing or invalid fields: name, email, and message must be non-empty strings.'
    })
    return
  }

  // Length limits and trimming
  const trimmedName = name.trim().slice(0, 80)
  const trimmedEmail = email.trim().slice(0, 100)
  const trimmedSubject = (typeof subject === 'string' && subject.trim() ? subject.trim() : 'Portfolio Contact Inquiry').slice(0, 150)
  const trimmedMessage = message.trim().slice(0, 3000)

  // Safe lens sanitization
  const validLenses = ['research', 'industry', 'general']
  const safeLens = (typeof lens === 'string' && validLenses.includes(lens.toLowerCase()))
    ? (lens.toLowerCase() as 'research' | 'industry' | 'general')
    : 'general'

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    })
    return
  }

  const newMessage: ContactSubmission = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: trimmedName,
    email: trimmedEmail,
    subject: trimmedSubject,
    message: trimmedMessage,
    lens: safeLens,
    timestamp: new Date().toISOString(),
    read: false
  }

  // Persist locally
  const currentMessages = readMessagesFromFile()
  currentMessages.unshift(newMessage)
  saveMessagesToFile(currentMessages)

  // Sync to Firestore if configured
  if (db) {
    try {
      await db.collection('contact_messages').doc(newMessage.id).set(newMessage)
    } catch (err) {
      console.error('Firestore save message error:', err)
    }
  }

  console.log('[Contact API Submission Saved]', {
    id: newMessage.id,
    name: newMessage.name,
    email: newMessage.email,
    subject: newMessage.subject
  })

  res.status(200).json({
    success: true,
    message: 'Thank you for reaching out! Your message has been sent successfully.',
    details: {
      receivedAt: newMessage.timestamp,
      sender: newMessage.name,
      email: newMessage.email
    }
  })
}

export const getContactMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    let messages = readMessagesFromFile()

    if (db) {
      try {
        const snapshot = await db.collection('contact_messages').orderBy('timestamp', 'desc').get()
        if (!snapshot.empty) {
          messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ContactSubmission)
        }
      } catch (err) {
        // Fallback to local messages
      }
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch contact messages' })
  }
}

export const deleteContactMessage = async (req: Request, res: Response): Promise<void> => {
  const rawId = req.params.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  if (!id) {
    res.status(400).json({ success: false, error: 'Message ID is required' })
    return
  }

  const messages = readMessagesFromFile().filter(m => m.id !== id)
  saveMessagesToFile(messages)

  if (db) {
    try {
      await db.collection('contact_messages').doc(id).delete()
    } catch (err) {
      console.error('Firestore delete message error:', err)
    }
  }

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully.'
  })
}
