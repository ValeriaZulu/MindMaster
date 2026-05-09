import { useCallback, useState } from 'react'
import type { Difficulty, LevelConfig, TriviaQuestion } from '../types/game'
import { loadFromStorage, saveToStorage } from '../utils/storage'

export const TRIVIA_LEVELS: Record<LevelConfig['id'], LevelConfig> = {
    novato: {
        id: 'novato',
        label: 'Novato',
        difficulty: 'easy',
        amount: 5,
        rewardCoins: 50,
    },
    aprendiz: {
        id: 'aprendiz',
        label: 'Aprendiz',
        difficulty: 'medium',
        amount: 10,
        rewardCoins: 100,
    },
    experto: {
        id: 'experto',
        label: 'Experto',
        difficulty: 'hard',
        amount: 15,
        rewardCoins: 200,
    },
}

const TRIVIA_CACHE_PREFIX = 'mm_trivia_cache_'

const FALLBACK_QUESTIONS: Record<Difficulty, TriviaQuestion[]> = {
    easy: [
        {
            category: 'General',
            type: 'multiple',
            difficulty: 'easy',
            question: '¿Cuál es el planeta más grande del sistema solar?',
            correctAnswer: 'Júpiter',
            incorrectAnswers: ['Marte', 'Saturno', 'Tierra'],
        },
        {
            category: 'General',
            type: 'multiple',
            difficulty: 'easy',
            question: '¿Cuántos días tiene una semana?',
            correctAnswer: '7',
            incorrectAnswers: ['5', '10', '12'],
        },
    ],
    medium: [
        {
            category: 'Ciencia',
            type: 'multiple',
            difficulty: 'medium',
            question: '¿Qué gas es más abundante en la atmósfera terrestre?',
            correctAnswer: 'Nitrógeno',
            incorrectAnswers: ['Oxígeno', 'Dióxido de carbono', 'Hidrógeno'],
        },
        {
            category: 'Historia',
            type: 'multiple',
            difficulty: 'medium',
            question: '¿En qué continente se originó la civilización egipcia?',
            correctAnswer: 'África',
            incorrectAnswers: ['Asia', 'Europa', 'Oceanía'],
        },
    ],
    hard: [
        {
            category: 'Tecnología',
            type: 'multiple',
            difficulty: 'hard',
            question: '¿Qué estructura de datos sigue el principio LIFO?',
            correctAnswer: 'Pila',
            incorrectAnswers: ['Cola', 'Árbol', 'Mapa'],
        },
        {
            category: 'Ciencia',
            type: 'multiple',
            difficulty: 'hard',
            question: '¿Cuál es el número atómico del oxígeno?',
            correctAnswer: '8',
            incorrectAnswers: ['6', '10', '12'],
        },
    ],
}

function getLevelConfig(levelId: LevelConfig['id']) {
    return TRIVIA_LEVELS[levelId]
}

export function buildTriviaUrl(params: { difficulty: Difficulty; amount: number }) {
    const searchParams = new URLSearchParams({
        amount: String(params.amount),
        type: 'multiple',
        difficulty: params.difficulty,
    })

    return `https://opentdb.com/api.php?${searchParams.toString()}`
}

function decodeText(value: string) {
    if (typeof window === 'undefined') {
        return value
    }

    const parser = new DOMParser()
    const document = parser.parseFromString(`<!doctype html><body>${value}`, 'text/html')

    return document.body.textContent ?? value
}

function buildFallbackQuestions(difficulty: Difficulty, amount: number) {
    const baseQuestions = FALLBACK_QUESTIONS[difficulty]

    return Array.from({ length: amount }, (_, index) => baseQuestions[index % baseQuestions.length])
}

function normalizeTriviaQuestions(rawQuestions: Array<{
    category: string
    type: 'multiple'
    difficulty: Difficulty
    question: string
    correct_answer: string
    incorrect_answers: string[]
}>) {
    return rawQuestions.map<TriviaQuestion>((question) => ({
        category: decodeText(question.category),
        type: 'multiple',
        difficulty: question.difficulty,
        question: decodeText(question.question),
        correctAnswer: decodeText(question.correct_answer),
        incorrectAnswers: question.incorrect_answers.map(decodeText),
    }))
}

function getCachedQuestions(levelId: LevelConfig['id']) {
    return loadFromStorage<TriviaQuestion[] | null>(`${TRIVIA_CACHE_PREFIX}${levelId}`, null)
}

function cacheQuestions(levelId: LevelConfig['id'], questions: TriviaQuestion[]) {
    saveToStorage(`${TRIVIA_CACHE_PREFIX}${levelId}`, questions)
}

async function loadTriviaQuestions(levelId: LevelConfig['id']) {
    const level = getLevelConfig(levelId)

    try {
        const response = await fetch(buildTriviaUrl(level))

        if (!response.ok) {
            throw new Error('Trivia request failed')
        }

        const data = (await response.json()) as {
            results: Array<{
                category: string
                type: 'multiple'
                difficulty: Difficulty
                question: string
                correct_answer: string
                incorrect_answers: string[]
            }>
        }

        const questions = normalizeTriviaQuestions(data.results)

        cacheQuestions(levelId, questions)
        return questions
    } catch {
        const cachedQuestions = getCachedQuestions(levelId)

        if (cachedQuestions && cachedQuestions.length > 0) {
            return cachedQuestions
        }

        const fallbackQuestions = buildFallbackQuestions(level.difficulty, level.amount)

        cacheQuestions(levelId, fallbackQuestions)
        return fallbackQuestions
    }
}

export function useTrivia() {
    const [questions, setQuestions] = useState<TriviaQuestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getQuestionsForLevel = useCallback(async (levelId: LevelConfig['id']) => {
        setIsLoading(true)
        setError(null)

        try {
            const loadedQuestions = await loadTriviaQuestions(levelId)

            setQuestions(loadedQuestions)
            return loadedQuestions
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : 'Error loading trivia'

            setError(message)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        questions,
        isLoading,
        error,
        getQuestionsForLevel,
        levelConfig: TRIVIA_LEVELS,
    }
}
