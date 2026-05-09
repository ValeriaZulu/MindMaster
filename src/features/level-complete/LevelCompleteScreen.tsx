import { Link, useParams } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'
import { useGameStore } from '../../store/gameStore'

export function LevelCompleteScreen() {
    const params = useParams()
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? params.levelId : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]
    const progress = useGameStore((state) => state.progress)

    return (
        <MobileLayout title="Nivel completado" subtitle={level.label}>
            <div className="space-y-4">
                <ScreenCard title="Buen trabajo" description="Esta pantalla más adelante mostrará recompensa, animación de victoria y siguiente paso.">
                    <div className="space-y-3">
                        <div className="rounded-2xl bg-master-accent/20 p-4 text-center font-semibold text-master-text">
                            Recompensa estimada: {level.rewardCoins} monedas
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
                                <p className="text-master-muted">Puntaje</p>
                                <p className="font-semibold text-master-primary">{progress.score}</p>
                            </div>
                            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
                                <p className="text-master-muted">Aciertos</p>
                                <p className="font-semibold text-master-primary">{progress.correctAnswers}</p>
                            </div>
                            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
                                <p className="text-master-muted">Vidas</p>
                                <p className="font-semibold text-master-primary">{progress.lives}</p>
                            </div>
                        </div>
                    </div>
                </ScreenCard>
                <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/levels">
                    Volver a niveles
                </Link>
            </div>
        </MobileLayout>
    )
}
