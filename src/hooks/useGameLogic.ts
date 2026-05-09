import { calculateScore } from '../utils/scoring'
import { useGameStore } from '../store/gameStore'
import type { LevelId } from '../types/game'

export function useGameLogic() {
    const progress = useGameStore((state) => state.progress)
    const startLevel = useGameStore((state) => state.startLevel)
    const answerCorrect = useGameStore((state) => state.answerCorrect)
    const answerIncorrect = useGameStore((state) => state.answerIncorrect)
    const setSecondsRemaining = useGameStore((state) => state.setSecondsRemaining)
    const resetProgress = useGameStore((state) => state.resetProgress)

    return {
        progress,
        finalScore: calculateScore({
            correctAnswers: progress.correctAnswers,
            lives: progress.lives,
            secondsRemaining: progress.secondsRemaining,
        }),
        startLevel: (levelId: LevelId) => startLevel(levelId),
        registerCorrectAnswer: answerCorrect,
        registerIncorrectAnswer: answerIncorrect,
        setSecondsRemaining,
        resetProgress,
    }
}