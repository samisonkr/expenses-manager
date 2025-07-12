
/**
 * @fileoverview
 * This file creates a mock instance of Firebase Auth and Firestore.
 * It's used during development when Firebase credentials are not available,
 * allowing the app to run without crashing. Data is stored in-memory
 * and is not persisted across reloads.
 * This file is no longer used, as we now handle missing credentials
 * in firebase.ts and rely on a guest mode with local storage.
 * It is kept for reference but can be safely removed.
 */
import type { FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

// A simple in-memory store to simulate Firestore
const memoryStore: Record<string, any> = {};

export function createMockFirebase() {
  const mockUser: User = {
    uid: "mock-user-id",
    email: "mock.user@example.com",
    displayName: "Mock User",
    photoURL: "",
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: "",
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => "mock-id-token",
    getIdTokenResult: async () => ({
      token: "mock-id-token",
      expirationTime: "",
      authTime: "",
      issuedAtTime: "",
      signInProvider: null,
      signInSecondFactor: null,
      claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
  };

  const mockAuth: Auth = {
    app: {} as FirebaseApp,
    currentUser: mockUser,
    onAuthStateChanged: (callback) => {
      // Immediately call back with the mock user
      setTimeout(() => callback(mockUser), 0);
      // Return an empty unsubscribe function
      return () => {};
    },
    // Add other methods as needed, with mock implementations
  } as unknown as Auth;

  const mockDb: Firestore = {
    app: {} as FirebaseApp,
    // Add mock implementations of Firestore functions
    // For this app, we mainly need doc, getDoc, and setDoc behavior.
  } as unknown as Firestore;

  // Mocking the global functions used in the app
  jest.mock("firebase/firestore", () => ({
    getFirestore: () => mockDb,
    doc: (db: any, path: string, ...pathSegments: string[]) => {
      const fullPath = [path, ...pathSegments].join('/');
      return {
        path: fullPath,
        // you can add other properties if your app uses them
      };
    },
    getDoc: async (docRef: any) => {
        const data = memoryStore[docRef.path];
        return Promise.resolve({
            exists: () => !!data,
            data: () => data,
            id: docRef.path.split('/').pop(),
        });
    },
    setDoc: async (docRef: any, data: any) => {
        memoryStore[docRef.path] = data;
        return Promise.resolve();
    },
  }));

  const mockApp: FirebaseApp = {
    name: "mock-app",
    options: {},
    automaticDataCollectionEnabled: false,
  };

  return {
    app: mockApp,
    auth: mockAuth,
    db: mockDb,
  };
}

// We need to provide a mock for jest even if it's not used in production builds.
if (typeof jest === 'undefined') {
    global.jest = {
        fn: () => ({
            mockImplementation: (fn: any) => fn
        }),
        mock: () => {},
    } as any;
}
