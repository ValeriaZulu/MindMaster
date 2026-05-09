import type { Difficulty, LevelConfig, TriviaQuestion } from '../types/game'

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

export function buildTriviaUrl(params: { difficulty: Difficulty; amount: number }) {
    const searchParams = new URLSearchParams({
        amount: String(params.amount),
        type: 'multiple',
        difficulty: params.difficulty,
    })

    return `https://opentdb.com/api.php?${searchParams.toString()}`
}

function decodeText(value: string) {
    const textArea = document.createElement('textarea')

    textArea.innerHTML = value
    return textArea.value
}

export async function fetchTriviaQuestions(levelId: LevelConfig['id']) {
    const level = TRIVIA_LEVELS[levelId]
    const response = await fetch(buildTriviaUrl(level))
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

    return data.results.map<TriviaQuestion>((question) => ({
        category: decodeText(question.category),
        type: 'multiple',
        difficulty: question.difficulty,
        question: decodeText(question.question),
        correctAnswer: decodeText(question.correct_answer),
        incorrectAnswers: question.incorrect_answers.map(decodeText),
    }))
}