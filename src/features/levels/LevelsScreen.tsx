import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'

export function LevelsScreen() {
    const levelList = Object.values(TRIVIA_LEVELS)

    return (
        <MobileLayout title="Seleccionar nivel" subtitle="Tres niveles con dificultad progresiva">
            <div className="space-y-4">
                <ScreenCard title="Niveles disponibles" description="Los datos ya están listos para consumir preguntas reales o mocks mientras avanzamos con Firebase.">
                    <div className="space-y-3">
                        {levelList.map((level) => (
                            <Link
                                key={level.id}
                                className="flex items-center justify-between rounded-2xl border border-master-border bg-master-surface px-4 py-4"
                                to={`/game/${level.id}`}
                            >
                                <div>
                                    <p className="font-semibold text-master-text">{level.label}</p>
                                    <p className="text-sm text-master-muted">{level.amount} preguntas · {level.rewardCoins} monedas</p>
                                </div>
                                <span className="text-sm font-semibold text-master-primary">{level.difficulty}</span>
                            </Link>
                        ))}
                    </div>
                </ScreenCard>
            </div>
        </MobileLayout>
    )
}
