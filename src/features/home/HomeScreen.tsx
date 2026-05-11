import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useGameStore } from '../../store/gameStore'

export function HomeScreen() {
    // Extraemos los datos base del store
    const userName = useGameStore((state) => state.userName)
    const coins = useGameStore((state) => state.coins)

    // Extraemos datos anidados según la estructura de tu gameStore.ts
    const bestScore = useGameStore((state) => state.user?.bestScore) || 0
    const currentLevelId = useGameStore((state) => state.progress.currentLevel) || 'Novato'

    // Dato estático para la racha (puedes implementarlo luego en el store si quieres)
    const dailyStreak = 5

    return (
        <MobileLayout title="Inicio" showHeader={false} showNavigation={true}>
            <div className="flex flex-col gap-6 pb-24">

                {/* HEADER: Usuario, Monedas y Nombre App */}
                <div className="flex items-center justify-between pt-4 px-2">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-2 border-master-primary bg-master-surface overflow-hidden shadow-sm flex items-center justify-center text-2xl">
                            {/* Puedes usar un emoji o un placeholder mientras configuras las fotos de perfil */}
                            👤
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-master-muted uppercase tracking-tighter leading-none">Usuario</span>
                            <span className="text-sm font-bold text-master-text truncate max-w-[80px]">{userName || 'Invitado'}</span>
                            <div className="flex items-center gap-1 text-master-primary font-black text-xs">
                                <span>$</span>
                                <span>{coins.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-master-primary italic tracking-tighter">MindMaster</h1>
                </div>

                {/* CARD PRINCIPAL: Invitación al juego */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-master-surface p-8 shadow-app border border-master-border flex flex-col items-center text-center gap-6">
                    <div className="relative">
                        <div className="h-24 w-24 bg-master-primary/10 rounded-full flex items-center justify-center border border-master-primary/20">
                            <span className="text-5xl">🧠</span>
                        </div>
                        <span className="absolute -top-1 -right-1 bg-master-accent text-[10px] font-black px-2 py-1 rounded-lg text-white shadow-neon animate-bounce">NUEVO</span>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold text-master-text tracking-tight">¿Listo para el desafío?</h2>
                        <p className="text-master-muted font-medium text-sm">Pon a prueba tus conocimientos hoy</p>
                    </div>

                    <Link
                        to="/levels"
                        className="w-full rounded-2xl bg-master-primary py-4 text-xl font-bold text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="text-base">▶</span>
                        <span>¡Jugar!</span>
                    </Link>
                </div>

                {/* GRID: Ranking y Créditos */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/ranking" className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-master-surface border border-master-border shadow-sm hover:shadow-md transition-all active:scale-95">
                        <div className="h-12 w-12 rounded-2xl bg-master-accent/10 flex items-center justify-center text-master-accent text-2xl shadow-inner">
                            📊
                        </div>
                        <span className="font-bold text-master-text text-center text-sm leading-tight">Ranking<br />Mundial</span>
                    </Link>
                    <Link to="/credits" className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-master-surface border border-master-border shadow-sm hover:shadow-md transition-all active:scale-95">
                        <div className="h-12 w-12 rounded-2xl bg-master-primary/10 flex items-center justify-center text-master-primary text-2xl shadow-inner">
                            👥
                        </div>
                        <span className="font-bold text-master-text text-sm">Créditos</span>
                    </Link>
                </div>

                {/* SECCIÓN: Tu Progreso */}
                <div className="mt-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-master-text tracking-tight">Tu Progreso</h3>
                        <Link to="/profile" className="text-[10px] font-black text-master-primary uppercase tracking-widest bg-master-primary/10 px-2 py-1 rounded-md">Ver todo</Link>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-master-surface-strong border border-master-border shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📈</span>
                                <span className="font-bold text-sm text-master-text">Mejor Puntaje</span>
                            </div>
                            <span className="font-black text-master-primary">{bestScore} pts</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-master-surface-strong border border-master-border shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🏆</span>
                                <span className="font-bold text-sm text-master-text">Nivel Actual</span>
                            </div>
                            <span className="font-black text-master-primary">{currentLevelId}</span>
                        </div>
                    </div>
                </div>

            </div>
        </MobileLayout>
    )
}