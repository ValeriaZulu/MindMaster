export type Difficulty = 'easy' | 'medium' | 'hard'
export type ThemeMode = 'light' | 'dark'
export type LevelId = 'novato' | 'aprendiz' | 'experto'

export type LevelConfig = {
    id: LevelId
    label: string
    difficulty: Difficulty
    amount: number
    rewardCoins: number
}

export type TriviaQuestion = {
    category: string
    type: 'multiple'
    difficulty: Difficulty
    question: string
    correctAnswer: string
    incorrectAnswers: string[]
}

export type UserProfile = {
    uid: string
    displayName: string
    photoURL?: string
    coins: number
    bestScore: number
}

export type GameProgress = {
    lives: number
    score: number
    correctAnswers: number
    secondsRemaining: number
    currentLevel: LevelId | null
}

export type AuthState = {
    user: UserProfile | null
    isAuthenticated: boolean
}