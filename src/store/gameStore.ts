import { create } from 'zustand'
import type { GameProgress, LevelId, ThemeMode, UserProfile } from '../types/game'
import { loadFromStorage, saveToStorage, removeFromStorage } from '../utils/storage'
import { db } from '../services/firebase'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

const USER_STORAGE_KEY = 'mm_user'
const PROGRESS_STORAGE_KEY = 'mm_progress'
const SETTINGS_STORAGE_KEY = 'mm_settings'

type SettingsState = {
    theme: ThemeMode
    soundEnabled: boolean
    musicEnabled: boolean
}

type GameStoreState = {
    user: UserProfile | null
    userName: string
    coins: number
    progress: GameProgress
    settings: SettingsState
    setUser: (user: UserProfile | null) => void
    setTheme: (theme: ThemeMode) => void
    toggleSound: () => void
    toggleMusic: () => void
    addCoins: (amount: number) => void
    spendCoins: (amount: number) => boolean
    startLevel: (levelId: LevelId) => void
    completeLevel: (levelId: LevelId, score: number) => Promise<void>
    answerCorrect: () => void
    answerIncorrect: () => void
    setSecondsRemaining: (secondsRemaining: number) => void
    setRoundScore: (score: number) => void
    setCorrectAnswers: (correctAnswers: number) => void
    updateBestScore: (score: number) => void
    resetProgress: () => void
    resetStore: () => void // Nueva función para logout
}

// Valores iniciales limpios
const initialProgressState: GameProgress = {
    lives: 3,
    score: 0,
    correctAnswers: 0,
    secondsRemaining: 0,
    currentLevel: 'novato',
}

const initialSettingsState: SettingsState = {
    theme: 'light',
    soundEnabled: true,
    musicEnabled: true,
}

export const useGameStore = create<GameStoreState>((set, get) => ({
    user: loadFromStorage<UserProfile | null>(USER_STORAGE_KEY, null),
    userName: loadFromStorage<UserProfile | null>(USER_STORAGE_KEY, null)?.displayName ?? '',
    coins: loadFromStorage<UserProfile | null>(USER_STORAGE_KEY, null)?.coins ?? 100,
    progress: loadFromStorage<GameProgress>(PROGRESS_STORAGE_KEY, initialProgressState),
    settings: loadFromStorage<SettingsState>(SETTINGS_STORAGE_KEY, initialSettingsState),

    setUser: (user) => {
        if (user === null) {
            get().resetStore();
            return;
        }
        set({
            user: user,
            userName: user.displayName ?? '',
            coins: user.coins ?? 100
        });
        saveToStorage(USER_STORAGE_KEY, user);
    },

    setTheme: (theme) => {
        const nextSettings = { ...get().settings, theme }
        set({ settings: nextSettings })
        saveToStorage(SETTINGS_STORAGE_KEY, nextSettings)
    },

    toggleSound: () => {
        const nextSettings = { ...get().settings, soundEnabled: !get().settings.soundEnabled }
        set({ settings: nextSettings })
        saveToStorage(SETTINGS_STORAGE_KEY, nextSettings)
    },

    toggleMusic: () => {
        const nextSettings = { ...get().settings, musicEnabled: !get().settings.musicEnabled }
        set({ settings: nextSettings })
        saveToStorage(SETTINGS_STORAGE_KEY, nextSettings)
    },

    addCoins: (amount) => {
        const nextCoins = get().coins + amount
        const user = get().user
        if (user) {
            const nextUser = { ...user, coins: nextCoins }
            set({ user: nextUser, coins: nextCoins })
            saveToStorage(USER_STORAGE_KEY, nextUser)
        }
    },

    spendCoins: (amount) => {
        if (get().coins < amount) return false
        const nextCoins = get().coins - amount
        const user = get().user
        if (user) {
            const nextUser = { ...user, coins: nextCoins }
            set({ user: nextUser, coins: nextCoins })
            saveToStorage(USER_STORAGE_KEY, nextUser)
        }
        return true
    },

    startLevel: (levelId) => {
        const nextProgress: GameProgress = {
            ...get().progress,
            ...initialProgressState,
            currentLevel: levelId,
        }
        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },

    completeLevel: async (levelId, score) => {
        const { user, progress } = get();
        const levelOrder: LevelId[] = ['novato', 'aprendiz', 'experto'];
        const currentIndex = levelOrder.indexOf(levelId);
        const nextLevelId = levelOrder[currentIndex + 1] || levelId;

        // 1. Actualizar progreso local
        const nextProgress = { ...progress, currentLevel: nextLevelId };
        set({ progress: nextProgress });
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress);

        if (user && user.uid) {
            const nextBestScore = Math.max(user.bestScore, score);

            // CORRECCIÓN CLAVE: Actualizamos completedLevels localmente también
            const isAlreadyCompleted = user.completedLevels?.includes(levelId);
            const nextCompletedLevels = isAlreadyCompleted
                ? user.completedLevels
                : [...(user.completedLevels || []), levelId];

            const nextUser = {
                ...user,
                bestScore: nextBestScore,
                completedLevels: nextCompletedLevels
            };

            // Actualizamos el estado para que la UI reaccione al instante
            set({ user: nextUser });
            saveToStorage(USER_STORAGE_KEY, nextUser);

            try {
                const userRef = doc(db!, 'users', user.uid);
                await updateDoc(userRef, {
                    bestScore: nextBestScore,
                    currentLevel: nextLevelId,
                    completedLevels: arrayUnion(levelId)
                });
            } catch (e) {
                console.error("Error sincronizando con Firebase:", e);
            }
        }
    },

    answerCorrect: () => {
        const currentProgress = get().progress
        const nextProgress: GameProgress = {
            ...currentProgress,
            correctAnswers: currentProgress.correctAnswers + 1,
            score: currentProgress.score + 100,
        }
        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },

    answerIncorrect: () => {
        const currentProgress = get().progress
        const nextLives = Math.max(0, currentProgress.lives - 1)
        const nextProgress: GameProgress = { ...currentProgress, lives: nextLives }
        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },

    setSecondsRemaining: (secondsRemaining) => {
        set({ progress: { ...get().progress, secondsRemaining } })
    },

    setRoundScore: (score) => {
        set({ progress: { ...get().progress, score } })
    },

    setCorrectAnswers: (correctAnswers) => {
        set({ progress: { ...get().progress, correctAnswers } })
    },

    updateBestScore: (score) => {
        const user = get().user
        if (!user) return
        const nextBestScore = Math.max(user.bestScore, score)
        const nextUser = { ...user, bestScore: nextBestScore }
        set({ user: nextUser })
        saveToStorage(USER_STORAGE_KEY, nextUser)
    },

    resetProgress: () => {
        set({ progress: initialProgressState })
        saveToStorage(PROGRESS_STORAGE_KEY, initialProgressState)
    },

    // Limpia todo al cerrar sesión para evitar "estados zombie"
    resetStore: () => {
        set({
            user: null,
            userName: '',
            coins: 100,
            progress: initialProgressState,
        });
        removeFromStorage(USER_STORAGE_KEY);
        removeFromStorage(PROGRESS_STORAGE_KEY);
    }
}))