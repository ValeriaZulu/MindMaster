import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

type FirebaseEnv = {
    VITE_FIREBASE_API_KEY?: string
    VITE_FIREBASE_AUTH_DOMAIN?: string
    VITE_FIREBASE_PROJECT_ID?: string
    VITE_FIREBASE_STORAGE_BUCKET?: string
    VITE_FIREBASE_MESSAGING_SENDER_ID?: string
    VITE_FIREBASE_APP_ID?: string
}

const firebaseEnv = import.meta.env as FirebaseEnv

export const firebaseConfig = {
    apiKey: firebaseEnv.VITE_FIREBASE_API_KEY,
    authDomain: firebaseEnv.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: firebaseEnv.VITE_FIREBASE_PROJECT_ID,
    storageBucket: firebaseEnv.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: firebaseEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: firebaseEnv.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
)

export const app = isFirebaseConfigured
    ? getApps().length > 0
        ? getApp()
        : initializeApp(firebaseConfig)
    : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
