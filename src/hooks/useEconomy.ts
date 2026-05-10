import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../services/firebase'
import { useGameStore } from '../store/gameStore'

const REWARD_SIGNATURE_STORAGE_KEY = 'mm_reward_signature'

export function useEconomy() {
    const user = useGameStore((state) => state.user)
    const coins = useGameStore((state) => state.coins)
    const addCoinsStore = useGameStore((state) => state.addCoins)
    const spendCoinsStore = useGameStore((state) => state.spendCoins)

    async function syncCoins(nextCoins: number) {
        if (!isFirebaseConfigured || !db || !user) {
            return
        }

        await setDoc(
            doc(db, 'users', user.uid),
            {
                uid: user.uid,
                displayName: user.displayName,
                coins: nextCoins,
                updatedAt: serverTimestamp(),
            },
            { merge: true },
        )
    }

    async function addCoins(amount: number) {
        if (amount <= 0) {
            return coins
        }

        const nextCoins = coins + amount

        addCoinsStore(amount)

        try {
            await syncCoins(nextCoins)
        } catch {
            // Mantener la persistencia local aunque Firestore falle.
        }

        return nextCoins
    }

    async function spendCoins(amount: number) {
        if (amount <= 0) {
            return true
        }

        const hasBalance = spendCoinsStore(amount)

        if (!hasBalance) {
            return false
        }

        const nextCoins = coins - amount

        try {
            await syncCoins(nextCoins)
        } catch {
            // Mantener la persistencia local aunque Firestore falle.
        }

        return true
    }

    return {
        coins,
        addCoins,
        spendCoins,
        canAfford: (amount: number) => coins >= amount,
    }
}

export function buildRewardSignature(params: {
    uid: string | null
    levelId: string
    score: number
    correctAnswers: number
    secondsRemaining: number
}) {
    return [
        params.uid ?? 'guest',
        params.levelId,
        params.score,
        params.correctAnswers,
        params.secondsRemaining,
    ].join('|')
}

export function hasRewardBeenGranted(signature: string) {
    return localStorage.getItem(REWARD_SIGNATURE_STORAGE_KEY) === signature
}

export function markRewardGranted(signature: string) {
    localStorage.setItem(REWARD_SIGNATURE_STORAGE_KEY, signature)
}
