
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseInitialized = false;

// This function will now be called from the AuthProvider
export function initializeFirebaseApp(config: object) {
  const hasAllKeys = Object.values(config).every(Boolean);

  if (hasAllKeys && !getApps().length) {
    try {
      app = initializeApp(config);
      auth = getAuth(app);
      db = getFirestore(app);
      isFirebaseInitialized = true;
      console.log("Firebase initialized successfully.");
    } catch (error) {
      console.error("Firebase initialization error:", error);
      isFirebaseInitialized = false;
    }
  } else if (getApps().length) {
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      isFirebaseInitialized = true;
  }
}

// Export the initialized instances and the status
export { app, auth, db, isFirebaseInitialized };
