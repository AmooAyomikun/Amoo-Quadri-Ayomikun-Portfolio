import { Request, Response } from 'express'
import { db } from '../config/firebase.js'

export interface GuestbookEntry {
  id?: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

export const getSignatures = async (req: Request, res: Response): Promise<void> => {
  if (!db) {
    res.status(503).json({ error: 'Firestore not initialized' })
    return
  }

  try {
    const snapshot = await db.collection('guestbook')
      .orderBy('timestamp', 'desc')
      .get();
      
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(entries);
  } catch (err) {
    console.error('Error reading guestbook from Firestore:', err)
    res.status(500).json({ error: 'Failed to fetch signatures' })
  }
}

export const addSignature = async (req: Request, res: Response): Promise<void> => {
  if (!db) {
    res.status(503).json({ error: 'Firestore not initialized' })
    return
  }

  const { name, message, signatureData } = req.body

  if (!name || (!message && !signatureData)) {
    res.status(400).json({ error: 'Name and either a message or signature are required.' })
    return
  }

  const profanityRegex = /fuck|shit|bitch|asshole|dick|pussy|cunt/i;
  if (profanityRegex.test(name) || (message && profanityRegex.test(message))) {
    res.status(400).json({ error: 'Inappropriate language detected. Please keep it professional.' })
    return
  }

  const newEntry = {
    name,
    message: message || '',
    signatureData: signatureData || '',
    timestamp: new Date().toISOString()
  }

  try {
    const docRef = await db.collection('guestbook').add(newEntry)
    res.status(201).json({ id: docRef.id, ...newEntry })
  } catch (err) {
    console.error('Error adding guestbook entry to Firestore:', err)
    res.status(500).json({ error: 'Failed to add signature' })
  }
}
