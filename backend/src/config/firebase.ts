import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the service account key
const serviceAccountPath = path.join(__dirname, '../../firebase-key.json');

// Initialize Firebase Admin only if it hasn't been initialized and the key exists
if (getApps().length === 0) {
  if (process.env.FIREBASE_CREDENTIALS) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully from environment variables.');
    } catch (error) {
      console.error('⚠️ Failed to parse FIREBASE_CREDENTIALS environment variable:', error);
    }
  } else if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully from file.');
  } else {
    console.warn('⚠️ Firebase service account key not found at:', serviceAccountPath);
    console.warn('⚠️ Firestore features will not work until you add firebase-key.json or FIREBASE_CREDENTIALS env var.');
  }
}

export const db = getApps().length > 0 ? getFirestore() : null;
