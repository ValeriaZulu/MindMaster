import { useCallback } from 'react'
import { playSound, stopAllSounds, playMusic, stopMusic } from '../services/sound' // Añade estos
import { useGameStore } from '../store/gameStore'

export function useSound() {
    const soundEnabled = useGameStore((state) => state.settings.soundEnabled)
    const musicEnabled = useGameStore((state) => state.settings.musicEnabled)

    const playEffect = useCallback((effect: 'correct' | 'incorrect' | 'powerup' | 'complete' | 'failed') => {
        if (!soundEnabled) return;
        playSound(effect);
    }, [soundEnabled])

    // Función para iniciar la música respetando el toggle de configuración
    const startBackgroundMusic = useCallback(() => {
        if (musicEnabled) {
            playMusic();
        }
    }, [musicEnabled]);

    const stopBackgroundMusic = useCallback(() => {
        stopMusic();
    }, []);

    const stopAll = useCallback(() => {
        stopAllSounds();
    }, [])

    return {
        soundEnabled,
        musicEnabled,
        playEffect,
        startBackgroundMusic, // Devuélvela aquí
        stopBackgroundMusic,  // Devuélvela aquí
        stopAll,
    }
}