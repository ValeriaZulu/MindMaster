import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { useGameStore } from '../../store/gameStore'

export function SettingsScreen() {
    const settings = useGameStore((state) => state.settings)
    const toggleSound = useGameStore((state) => state.toggleSound)
    const toggleMusic = useGameStore((state) => state.toggleMusic)
    const setTheme = useGameStore((state) => state.setTheme)

    return (
        <MobileLayout title="Configuración" subtitle="Ajustes de experiencia y tema">
            <div className="space-y-4">
                <ScreenCard title="Tema" description="Puedes alternar entre claro y oscuro manteniendo la misma estética futurista.">
                    <div className="grid grid-cols-2 gap-3">
                        <button className="rounded-2xl bg-master-surface px-4 py-4 font-semibold text-master-primary" onClick={() => setTheme('light')} type="button">
                            Claro
                        </button>
                        <button className="rounded-2xl bg-master-surface px-4 py-4 font-semibold text-master-primary" onClick={() => setTheme('dark')} type="button">
                            Oscuro
                        </button>
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
