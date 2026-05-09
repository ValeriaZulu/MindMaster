import { useEffect, useState } from 'react'
import type { AuthState, UserProfile } from '../types/game'
import { loadFromStorage, removeFromStorage, saveToStorage } from '../utils/storage'

const AUTH_STORAGE_KEY = 'mm_auth_user'

function createFallbackId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `user-${Date.now()}`
}

export function useAuth() {
    const [state, setState] = useState<AuthState>(() => {
        const storedUser = loadFromStorage<UserProfile | null>(AUTH_STORAGE_KEY, null)

        return {
            user: storedUser,
            isAuthenticated: Boolean(storedUser),
        }
    })

    useEffect(() => {
        saveToStorage(AUTH_STORAGE_KEY, state.user)
    }, [state.user])

    function signIn(displayName: string) {
        const nextUser: UserProfile = {
            uid: createFallbackId(),
            displayName,
            coins: state.user?.coins ?? 100,
            bestScore: state.user?.bestScore ?? 0,
        }

        setState({ user: nextUser, isAuthenticated: true })
        saveToStorage(AUTH_STORAGE_KEY, nextUser)
    }

    function signOut() {
        setState({ user: null, isAuthenticated: false })
        removeFromStorage(AUTH_STORAGE_KEY)
    }

    return {
        ...state,
        signIn,
        signOut,
    }
}