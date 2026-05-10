import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useTheme() {
    const theme = useGameStore((state) => state.settings.theme)

    useEffect(() => {
        const root = document.documentElement

        root.classList.toggle('dark', theme === 'dark')
    }, [theme])

    return {
        theme,
        isDarkMode: theme === 'dark',
    }
}
