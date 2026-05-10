import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { db, isFirebaseConfigured } from '../services/firebase'
import { useGameStore } from '../store/gameStore'

type RankingEntry = {
    uid: string
    displayName: string
    bestScore: number
    photoURL?: string
}

export function useRanking() {
    const currentUser = useGameStore((state) => state.user)
    const [ranking, setRanking] = useState<RankingEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            if (!isFirebaseConfigured || !db) {
                const fallback = currentUser
                    ? [
                        {
                            uid: currentUser.uid,
                            displayName: currentUser.displayName,
                            bestScore: currentUser.bestScore,
                            photoURL: currentUser.photoURL,
                        },
                    ]
                    : []

                setRanking(fallback)
                setError('Firebase no está configurado. Mostrando ranking local.')
                return
            }

            const usersRef = collection(db, 'users')
            const rankingQuery = query(usersRef, orderBy('bestScore', 'desc'), limit(100))
            const snapshot = await getDocs(rankingQuery)

            const entries = snapshot.docs.map((document) => {
                const data = document.data() as {
                    uid?: string
                    displayName?: string
                    bestScore?: number
                    photoURL?: string
                }

                return {
                    uid: data.uid ?? document.id,
                    displayName: data.displayName ?? 'Jugador',
                    bestScore: data.bestScore ?? 0,
                    photoURL: data.photoURL,
                }
            })

            setRanking(entries)
        } catch {
            setError('No se pudo cargar el ranking global.')
        } finally {
            setIsLoading(false)
        }
    }, [currentUser])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return {
        ranking,
        isLoading,
        error,
        refresh,
    }
}
