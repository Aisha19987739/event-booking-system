// src/firebase/firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from './firebaseConfig.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'your-bucket-id.appspot.com', // استبدله بالـ bucket من Firebase
});

const bucket = admin.storage().bucket();

export { bucket };
