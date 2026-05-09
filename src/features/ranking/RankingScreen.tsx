import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'

const mockRanking = [
    { name: 'User 1', score: 31200 },
    { name: 'User 2', score: 28900 },
    { name: 'User 3', score: 26700 },
]

export function RankingScreen() {
    return (
        <MobileLayout title="Ranking mundial" subtitle="Puntajes globales y posición del jugador">
            <div className="space-y-4">
                <ScreenCard title="Top global" description="Por ahora se muestran datos mock; pronto se conectará Firestore para guardar y ordenar puntajes reales.">
                    <div className="space-y-3">
                        {mockRanking.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-black/5 px-4 py-3 dark:bg-white/5">
                                <p className="font-semibold text-master-text">{index + 1}. {entry.name}</p>
                                <p className="font-semibold text-master-primary">{entry.score}</p>
                            </div>
                        ))}
                    </div>
                </ScreenCard>
                <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/home">
                    Volver al menú
                </Link>
            </div>
        </MobileLayout>
    )
}
