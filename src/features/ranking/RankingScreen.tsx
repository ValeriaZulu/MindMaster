import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { RankingCard } from '../../components/ui/RankingCard'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { useRanking } from '../../hooks/useRanking'
import { useGameStore } from '../../store/gameStore'

export function RankingScreen() {
    const currentUser = useGameStore((state) => state.user)
    const { ranking, isLoading, error, refresh } = useRanking()

    return (
        <MobileLayout title="Ranking mundial" subtitle="Puntajes globales y posición del jugador">
            <div className="space-y-4">
                <ScreenCard title="Top global" description="Listado descendente por bestScore desde Firestore.">
                    <button
                        className="mb-3 w-full rounded-2xl border border-master-border bg-master-surface px-4 py-3 text-sm font-semibold text-master-primary"
                        onClick={() => {
                            void refresh()
                        }}
                        type="button"
                    >
                        {isLoading ? 'Actualizando ranking...' : 'Actualizar ranking'}
                    </button>

                    {error ? <p className="mb-3 rounded-xl bg-amber-100/80 px-3 py-2 text-sm font-semibold text-amber-900">{error}</p> : null}

                    <div className="space-y-3">
                        {ranking.map((entry, index) => (
                            <RankingCard
                                key={entry.uid}
                                isCurrentUser={entry.uid === currentUser?.uid}
                                name={entry.displayName}
                                rank={index + 1}
                                score={entry.bestScore}
                            />
                        ))}

                        {!isLoading && ranking.length === 0 ? (
                            <p className="rounded-xl bg-black/5 px-4 py-3 text-sm text-master-muted dark:bg-white/5">
                                Aún no hay puntajes para mostrar.
                            </p>
                        ) : null}
                    </div>
                </ScreenCard>
                <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/home">
                    Volver al menú
                </Link>
            </div>
        </MobileLayout>
    )
}
