import { useState } from 'react'
import { useEconomy } from './useEconomy'

export const POWER_UP_COSTS = {
    fiftyFifty: 40,
    skipQuestion: 60,
} as const

type PowerUpFeedback = {
    message: string
    type: 'success' | 'error' | 'info'
}

export function usePowerUp() {
    const { coins, spendCoins, canAfford } = useEconomy()
    const [feedback, setFeedback] = useState<PowerUpFeedback | null>(null)

    async function activateFiftyFifty(params: {
        options: string[]
        correctAnswer: string
        alreadyUsed: boolean
    }) {
        if (params.alreadyUsed) {
            setFeedback({ message: 'Ya usaste 50/50 en esta pregunta.', type: 'info' })
            return { success: false, options: params.options }
        }

        if (!canAfford(POWER_UP_COSTS.fiftyFifty)) {
            setFeedback({ message: 'No tienes monedas suficientes para 50/50.', type: 'error' })
            return { success: false, options: params.options }
        }

        const paid = await spendCoins(POWER_UP_COSTS.fiftyFifty)

        if (!paid) {
            setFeedback({ message: 'No tienes monedas suficientes para 50/50.', type: 'error' })
            return { success: false, options: params.options }
        }

        const incorrect = params.options.filter((option) => option !== params.correctAnswer)
        const shuffledIncorrect = [...incorrect].sort(() => Math.random() - 0.5)
        const optionToKeep = shuffledIncorrect[0]
        const filteredOptions = params.options.filter(
            (option) => option === params.correctAnswer || option === optionToKeep,
        )

        setFeedback({ message: '50/50 activado. Se eliminaron 2 opciones.', type: 'success' })

        return { success: true, options: filteredOptions }
    }

    async function activateSkipQuestion(params: { alreadyUsed: boolean }) {
        if (params.alreadyUsed) {
            setFeedback({ message: 'Ya usaste Skip en esta pregunta.', type: 'info' })
            return false
        }

        if (!canAfford(POWER_UP_COSTS.skipQuestion)) {
            setFeedback({ message: 'No tienes monedas suficientes para Skip.', type: 'error' })
            return false
        }

        const paid = await spendCoins(POWER_UP_COSTS.skipQuestion)

        if (!paid) {
            setFeedback({ message: 'No tienes monedas suficientes para Skip.', type: 'error' })
            return false
        }

        setFeedback({ message: 'Pregunta saltada sin penalización.', type: 'success' })
        return true
    }

    return {
        coins,
        feedback,
        setFeedback,
        canUseFiftyFifty: canAfford(POWER_UP_COSTS.fiftyFifty),
        canUseSkipQuestion: canAfford(POWER_UP_COSTS.skipQuestion),
        activateFiftyFifty,
        activateSkipQuestion,
    }
}
