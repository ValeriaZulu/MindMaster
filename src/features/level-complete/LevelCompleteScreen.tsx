import { Link, useParams } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'

export function LevelCompleteScreen() {
    const params = useParams()
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? params.levelId : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]

    return (
        <MobileLayout title="Nivel completado" subtitle={level.label}>
            <div className="space-y-4">
                <ScreenCard title="Buen trabajo" description="Esta pantalla más adelante mostrará recompensa, animación de victoria y siguiente paso.">
                    <div className="rounded-2xl bg-master-accent/20 p-4 text-center font-semibold text-master-text">
                        Recompensa estimada: {level.rewardCoins} monedas
                    </div>
                </ScreenCard>
                <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/levels">
                    Volver a niveles
                </Link>
            </div>
        </MobileLayout>
    )
}
