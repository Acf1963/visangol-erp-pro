import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
// Nota: Em produção, estas variáveis devem estar no .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visangol-erp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visangol-erp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visangol-erp.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

let app;
let dbInstance;

try {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error", error);
}

export const db = dbInstance as ReturnType<typeof getFirestore>;
