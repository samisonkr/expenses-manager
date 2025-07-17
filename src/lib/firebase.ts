
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This function now returns a boolean indicating success
function initializeFirebase(): boolean {
  const hasAllFirebaseKeys =
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId;

  if (hasAllFirebaseKeys) {
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        return true;
      } catch (error) {
        console.error("Firebase initialization error:", error);
        return false;
      }
    } else {
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      return true;
    }
  }
  return false;
}

const isFirebaseInitialized = initializeFirebase();

if (!isFirebaseInitialized) {
  console.warn("Firebase config is incomplete. App will work in guest-mode only.");
  // Provide mock objects if initialization failed to prevent crashes
  app = app || ({ name: "mock-app", options: {} } as FirebaseApp);
  auth = auth || ({} as Auth);
  db = db || ({} as Firestore);
}

export { app, auth, db, isFirebaseInitialized };
