import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  try {
    if (!auth) {
      auth = getAuth(getFirebaseApp());
    }
    return auth;
  } catch (error) {
    console.error("Error initializing Firebase Auth:", error);
    throw error;
  }
}

export function getFirebaseDb(): Firestore {
  try {
    if (!db) {
      db = getFirestore(getFirebaseApp());
    }

    return db;
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    throw error;
  }
}

export function getFirebaseStorage(): FirebaseStorage {
  try {
    if (!storage) {
      storage = getStorage(getFirebaseApp());
    }
    return storage;
  } catch (error) {
    console.error("Error initializing Firebase Storage:", error);
    throw error;
  }
}
