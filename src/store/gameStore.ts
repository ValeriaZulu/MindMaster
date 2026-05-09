import { create } from 'zustand'
import type { GameProgress, LevelId, ThemeMode, UserProfile } from '../types/game'
import { loadFromStorage, saveToStorage } from '../utils/storage'

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
    setUserName: (userName: string) => void
    setUser: (user: UserProfile | null) => void
    setTheme: (theme: ThemeMode) => void
    toggleSound: () => void
    toggleMusic: () => void
    addCoins: (amount: number) => void
    spendCoins: (amount: number) => boolean
    startLevel: (levelId: LevelId) => void
    answerCorrect: () => void
    answerIncorrect: () => void
    setSecondsRemaining: (secondsRemaining: number) => void
    setRoundScore: (score: number) => void
    setCorrectAnswers: (correctAnswers: number) => void
    updateBestScore: (score: number) => void
    resetProgress: () => void
}

const initialUser = loadFromStorage<UserProfile | null>(USER_STORAGE_KEY, null)
const initialProgress = loadFromStorage<GameProgress>(PROGRESS_STORAGE_KEY, {
    lives: 3,
    score: 0,
    correctAnswers: 0,
    secondsRemaining: 0,
    currentLevel: null,
})
const initialSettings = loadFromStorage<SettingsState>(SETTINGS_STORAGE_KEY, {
    theme: 'light',
    soundEnabled: true,
    musicEnabled: true,
})

export const useGameStore = create<GameStoreState>((set, get) => ({
    user: initialUser,
    userName: initialUser?.displayName ?? '',
    coins: initialUser?.coins ?? 100,
    progress: initialProgress,
    settings: initialSettings,
    setUserName: (userName) => {
        const currentUser = get().user
        const nextUser = currentUser ? { ...currentUser, displayName: userName } : null

        set({ userName, user: nextUser })
        saveToStorage(USER_STORAGE_KEY, nextUser)
    },
    setUser: (user) => {
        set({ user, userName: user?.displayName ?? '', coins: user?.coins ?? 100 })
        saveToStorage(USER_STORAGE_KEY, user)
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

        set({ coins: nextCoins })

        const user = get().user

        if (user) {
            const nextUser = { ...user, coins: nextCoins }

            set({ user: nextUser })
            saveToStorage(USER_STORAGE_KEY, nextUser)
        }
    },
    spendCoins: (amount) => {
        if (get().coins < amount) {
            return false
        }

        const nextCoins = get().coins - amount

        set({ coins: nextCoins })

        const user = get().user

        if (user) {
            const nextUser = { ...user, coins: nextCoins }

            set({ user: nextUser })
            saveToStorage(USER_STORAGE_KEY, nextUser)
        }

        return true
    },
    startLevel: (levelId) => {
        const nextProgress: GameProgress = {
            ...get().progress,
            lives: 3,
            score: 0,
            correctAnswers: 0,
            secondsRemaining: 0,
            currentLevel: levelId,
        }

        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
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
        const nextProgress: GameProgress = {
            ...currentProgress,
            lives: nextLives,
        }

        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },
    setSecondsRemaining: (secondsRemaining) => {
        const nextProgress = { ...get().progress, secondsRemaining }

        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },
    setRoundScore: (score) => {
        const nextProgress = { ...get().progress, score }

        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },
    setCorrectAnswers: (correctAnswers) => {
        const nextProgress = { ...get().progress, correctAnswers }

        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },
    updateBestScore: (score) => {
        const user = get().user

        if (!user) {
            return
        }

        const nextBestScore = Math.max(user.bestScore, score)
        const nextUser = { ...user, bestScore: nextBestScore }

        set({ user: nextUser })
        saveToStorage(USER_STORAGE_KEY, nextUser)
    },
    resetProgress: () => {
        const nextProgress: GameProgress = {
            lives: 3,
            score: 0,
            correctAnswers: 0,
            secondsRemaining: 0,
            currentLevel: null,
        }

        set({ progress: nextProgress })
        saveToStorage(PROGRESS_STORAGE_KEY, nextProgress)
    },
}))

export function persistCurrentState() {
    const { user, progress, settings } = useGameStore.getState()

    saveToStorage(USER_STORAGE_KEY, user)
    saveToStorage(PROGRESS_STORAGE_KEY, progress)
    saveToStorage(SETTINGS_STORAGE_KEY, settings)
}