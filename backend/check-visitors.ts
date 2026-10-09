import { db } from './src/config/firebase.js';

async function checkVisitors() {
  if (!db) {
    console.error("Firestore not initialized");
    return;
  }
  
  const snapshot = await db.collection('visitors').get();
  console.log(`Total visitors in Firestore: ${snapshot.size}`);
  for (const doc of snapshot.docs) {
    console.log(doc.data().country, doc.data().ip);
  }
  process.exit(0);
}

checkVisitors();
