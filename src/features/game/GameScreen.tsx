import { Link, useParams } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'

export function GameScreen() {
    const params = useParams()
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? params.levelId : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]

    return (
        <MobileLayout title="Pantalla de juego" subtitle={`Nivel ${level.label}`}>
            <div className="space-y-4">
                <ScreenCard
                    title="Fase base del juego"
                    description="Aquí vivirá la lógica de preguntas, vidas, temporizador, puntaje y power-ups. Por ahora sólo dejamos la estructura visual y de rutas."
                />
                <div className="grid grid-cols-2 gap-3">
                    <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to={`/level-complete/${level.id}`}>
                        Completar mock
                    </Link>
                    <Link className="rounded-2xl border border-master-border bg-master-surface-strong px-4 py-4 text-center font-semibold text-master-primary" to="/levels">
                        Salir
                    </Link>
                </div>
            </div>
        </MobileLayout>
    )
}
