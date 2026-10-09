import { db } from './src/config/firebase.js';

async function deleteFoulSignatures() {
  if (!db) {
    console.error("Firestore not initialized");
    return;
  }
  const profanityRegex = /fuck|shit|bitch|asshole|dick|pussy|cunt/i;
  
  const snapshot = await db.collection('guestbook').get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (profanityRegex.test(data.name) || (data.message && profanityRegex.test(data.message))) {
      console.log(`Deleting doc ${doc.id}: ${data.name} - ${data.message}`);
      await db.collection('guestbook').doc(doc.id).delete();
    }
  }
  console.log("Cleanup complete.");
  process.exit(0);
}

deleteFoulSignatures();
