import { useEffect, useState } from 'react'
import { signInAnonymously, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../services/firebase'
import { useGameStore } from '../store/gameStore'
import type { AuthState, UserProfile } from '../types/game'
import { loadFromStorage, removeFromStorage, saveToStorage } from '../utils/storage'

const AUTH_STORAGE_KEY = 'mm_auth_user'
const AUTH_NAME_KEY = 'mm_user_name'

function createFallbackId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `user-${Date.now()}`
}

function createAnonymousProfile(displayName: string): UserProfile {
    return {
        uid: createFallbackId(),
        displayName,
        coins: 100,
        bestScore: 0,
        completedLevels: []
    }
}

export function useAuth() {
    const setUser = useGameStore((state) => state.setUser)
    const [state, setState] = useState<AuthState>(() => {
        const storedUser = loadFromStorage<UserProfile | null>(AUTH_STORAGE_KEY, null)

        return {
            user: storedUser,
            isAuthenticated: Boolean(storedUser),
        }
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (state.user) {
            saveToStorage(AUTH_STORAGE_KEY, state.user)
            saveToStorage(AUTH_NAME_KEY, state.user?.displayName ?? '')
            setUser(state.user)
        }
    }, [setUser, state.user])

    async function signIn(displayName: string) {
        const trimmedName = displayName.trim()

        if (!trimmedName) {
            throw new Error('El nombre de usuario es obligatorio')
        }

        setLoading(true)

        try {
            if (isFirebaseConfigured && auth) {
                const credential = await signInAnonymously(auth)
                const uid = credential.user.uid

                await updateProfile(credential.user, { displayName: trimmedName })

                if (db) {
                    await setDoc(
                        doc(db, 'users', uid),
                        {
                            uid,
                            displayName: trimmedName,
                            coins: state.user?.coins ?? 100,
                            bestScore: state.user?.bestScore ?? 0,
                            authProvider: 'anonymous',
                            updatedAt: serverTimestamp(),
                        },
                        { merge: true },
                    )
                }

                const nextUser: UserProfile = {
                    uid,
                    displayName: trimmedName,
                    coins: state.user?.coins ?? 100,
                    bestScore: state.user?.bestScore ?? 0,
                    completedLevels: state.user?.completedLevels ?? []
                }

                setState({ user: nextUser, isAuthenticated: true })
                saveToStorage(AUTH_STORAGE_KEY, nextUser)
                saveToStorage(AUTH_NAME_KEY, trimmedName)
                return nextUser
            }

            const fallbackUser = createAnonymousProfile(trimmedName)

            setState({ user: fallbackUser, isAuthenticated: true })
            saveToStorage(AUTH_STORAGE_KEY, fallbackUser)
            saveToStorage(AUTH_NAME_KEY, trimmedName)
            return fallbackUser
        } finally {
            setLoading(false)
        }
    }

    function signOut() {
        setState({ user: null, isAuthenticated: false })
        removeFromStorage(AUTH_STORAGE_KEY)
        removeFromStorage(AUTH_NAME_KEY)
    }

    return {
        ...state,
        loading,
        signIn,
        signOut,
    }
}
