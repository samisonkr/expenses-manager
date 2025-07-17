
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

function initializeFirebase() {
  const hasAllFirebaseKeys =
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId;

  if (hasAllFirebaseKeys && !getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Fallback to mock objects if initialization fails
        app = { name: "mock-app", options: {} } as FirebaseApp;
        auth = {} as Auth;
        db = {} as Firestore;
    }
  } else if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // A simple mock for environments without real keys, prevents crashes
    app = { name: "mock-app", options: {} } as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
    console.warn("Firebase config is incomplete. App will work in guest-mode only with limited functionality until configured.");
  }
}

// Call the function to initialize
initializeFirebase();

export { app, auth, db };
