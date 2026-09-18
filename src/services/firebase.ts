import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCq0ePxrwjUFlOy1MRObXiImkgu4DGLfTc",
  authDomain: "cistec-totem.firebaseapp.com",
  projectId: "cistec-totem",
  storageBucket: "cistec-totem.firebasestorage.app",
  messagingSenderId: "995019909200",
  appId: "1:995019909200:web:5a749e3d16d63775420955"
};

// Initialize or reuse existing Firebase app
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
