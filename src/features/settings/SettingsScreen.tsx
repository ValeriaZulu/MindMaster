import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { useGameStore } from '../../store/gameStore'

export function SettingsScreen() {
    const settings = useGameStore((state) => state.settings)
    const toggleSound = useGameStore((state) => state.toggleSound)
    const toggleMusic = useGameStore((state) => state.toggleMusic)
    const setTheme = useGameStore((state) => state.setTheme)

    const isDarkMode = settings.theme === 'dark'

    return (
        <MobileLayout title="Configuración" subtitle="Ajustes de experiencia y tema">
            <div className="space-y-4">
                <ScreenCard title="Tema" description="Alterna entre modo claro y oscuro con transición visual suave.">
                    <div className="space-y-3">
                        <button
                            className="flex min-h-11 w-full items-center justify-between rounded-2xl border border-master-border bg-master-surface px-4 py-3 font-semibold text-master-primary"
                            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                            type="button"
                        >
                            <span>{isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}</span>
                            <span className="rounded-full bg-master-accent/20 px-2 py-1 text-xs text-master-text">
                                {isDarkMode ? 'Dark ON' : 'Light ON'}
                            </span>
                        </button>

                        <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
                            <button
                                className="min-h-11 rounded-2xl border border-master-border bg-master-surface px-4 py-3 text-master-primary"
                                onClick={() => setTheme('light')}
                                type="button"
                            >
                                Claro
                            </button>
                            <button
                                className="min-h-11 rounded-2xl border border-master-border bg-master-surface px-4 py-3 text-master-primary"
                                onClick={() => setTheme('dark')}
                                type="button"
                            >
                                Oscuro
                            </button>
                        </div>
                    </div>
                </ScreenCard>

                <ScreenCard title="Sonido" description="Los switches quedan preparados para efectos y música ambiente.">
                    <div className="space-y-3">
                        <button className="w-full rounded-2xl bg-black/5 px-4 py-4 text-left font-semibold text-master-text dark:bg-white/5" onClick={toggleSound} type="button">
                            Efectos de sonido: {settings.soundEnabled ? 'Activados' : 'Desactivados'}
                        </button>
                        <button className="w-full rounded-2xl bg-black/5 px-4 py-4 text-left font-semibold text-master-text dark:bg-white/5" onClick={toggleMusic} type="button">
                            Música de fondo: {settings.musicEnabled ? 'Activada' : 'Desactivada'}
                        </button>
                    </div>
                </ScreenCard>
            </div>
        </MobileLayout>
    )
}
