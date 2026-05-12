import { Link } from 'react-router-dom'
import { useState } from 'react'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useGameStore } from '../../store/gameStore'
import confetti from 'canvas-confetti';


export function HomeScreen() {
    // Extraemos los datos base del store
    const userName = useGameStore((state) => state.userName)
    const user = useGameStore((state) => state.user)
    const coins = useGameStore((state) => state.coins)

    const addCoins = useGameStore((state) => state.addCoins)

    const [brainClicks, setBrainClicks] = useState(0)
    const [easterEggFound, setEasterEggFound] = useState(false)

    // Extraemos datos anidados según la estructura de gameStore.ts
    const bestScore = useGameStore((state) => state.user?.bestScore) || 0
    const currentLevelId = useGameStore((state) => state.progress.currentLevel) || 'Novato'

    // Dato estático para la racha 
    //const dailyStreak = 5

    const handleBrainClick = () => {
        if (easterEggFound) return

        const nextClicks = brainClicks + 1
        setBrainClicks(nextClicks)

        if (nextClicks >= 3) {
            addCoins(50)
            setEasterEggFound(true)
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6D4AFF', '#007A43', '#FFD700']
            });

        }
    }

    return (
        <MobileLayout title="Inicio" showHeader={false} showNavigation={true}>
            <div className="flex flex-col gap-6 pb-24">

                {/* HEADER: Usuario, Monedas y Nombre App */}
                <div className="flex items-center justify-between pt-4 px-2">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-2 border-master-primary shadow-neon bg-master-surface overflow-hidden shadow-sm">
                            <img
                                alt="Perfil"
                                className="h-full w-full object-cover"
                                src={
                                    user?.photoURL ||
                                    `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
                                        userName || 'User'
                                    )}`
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-master-text truncate max-w-[80px]">{userName || 'Invitado'}</span>
                            <div className="text-yellow-500 font-bold flex items-center gap-1 text-master-primary font-black text-xs">
                                <span>$</span>
                                <span>{coins.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-master-primary italic tracking-tighter">MindMaster</h1>
                </div>

                {/* CARD PRINCIPAL: Invitación al juego */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-master-surface p-8 shadow-app border border-master-border flex flex-col items-center text-center gap-6">
                    <div
                        className="relative cursor-pointer active:scale-95 transition-transform"
                        onClick={handleBrainClick}
                    >
                        <div className="h-24 w-24 bg-master-primary/10 rounded-full flex items-center justify-center border border-master-primary/20">
                            <span className="text-5xl">🧠</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold text-master-text tracking-tight">¿Listo para el desafío?</h2>
                        <p className="text-master-muted font-medium text-sm">Pon a prueba tus conocimientos hoy</p>
                        {easterEggFound && (
                            <p className="text-yellow-500 font-bold text-sm animate-pulse">
                                🪺 Easter Egg: + 50 monedas
                            </p>
                        )}
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
                        <Link to="/profile" className="flex items-center justify-center text-[10px] font-black text-master-primary uppercase tracking-widest bg-master-primary/10 px-2 h-6 rounded-md">Ver todo</Link>
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