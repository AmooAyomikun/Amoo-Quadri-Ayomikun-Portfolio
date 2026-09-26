import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the service account key
const serviceAccountPath = path.join(__dirname, '../../firebase-key.json');

// Initialize Firebase Admin only if it hasn't been initialized and the key exists
if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.warn('⚠️ Firebase service account key not found at:', serviceAccountPath);
    console.warn('⚠️ Firestore features will not work until you add firebase-key.json.');
  }
}

export const db = admin.apps.length ? admin.firestore() : null;
