import { useCallback, useState } from 'react'
import type { LevelConfig, TriviaQuestion } from '../types/game'
import { SPA_QUESTIONS } from '../data/questions'

export const TRIVIA_LEVELS: Record<string, LevelConfig> = {
    novato: {
        id: 'novato',
        label: 'Novato',
        difficulty: 'easy',
        amount: 5,
        rewardCoins: 50
    },
    aprendiz: {
        id: 'aprendiz',
        label: 'Aprendiz',
        difficulty: 'medium',
        amount: 10,
        rewardCoins: 100
    },
    experto: {
        id: 'experto',
        label: 'Experto',
        difficulty: 'hard',
        amount: 15,
        rewardCoins: 200
    },
}

export function useTrivia() {
    const [questions, setQuestions] = useState<TriviaQuestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getQuestionsForLevel = useCallback(async (levelId: string) => {
        setIsLoading(true)
        try {
            const config = TRIVIA_LEVELS[levelId] || TRIVIA_LEVELS.novato;

            // Simulación de carga para que el spinner no desaparezca instantáneamente
            await new Promise(resolve => setTimeout(resolve, 1000));

            const allOfDifficulty = [...SPA_QUESTIONS[config.difficulty]];
            const shuffled = allOfDifficulty.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, config.amount);

            setQuestions(selected);
            return selected;
        } catch (e) {
            setError("No se pudieron cargar las preguntas locales.");
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [])

    return { questions, isLoading, error, getQuestionsForLevel }
}