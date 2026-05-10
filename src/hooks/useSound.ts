import { useCallback } from 'react'
import { playSound, stopAllSounds } from '../services/sound'
import { useGameStore } from '../store/gameStore'

export function useSound() {
    const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
    const musicEnabled = useGameStore((state) => state.settings.musicEnabled)

    const playEffect = useCallback((effect: 'correct' | 'incorrect' | 'powerup' | 'complete') => {
        if (!soundEnabled) {
            return
        }

        playSound(effect)
    }, [soundEnabled])

    const stopAll = useCallback(() => {
        stopAllSounds()
    }, [])

    return {
        soundEnabled,
        musicEnabled,
        playEffect,
        stopAll,
    }
}
