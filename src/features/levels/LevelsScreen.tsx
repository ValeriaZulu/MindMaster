import { Link, useNavigate } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'
import { useGameStore } from '../../store/gameStore'
import { LevelId } from '../../types/game'

export function LevelsScreen() {
    const navigate = useNavigate()
    const levelList = Object.values(TRIVIA_LEVELS)
    const levelOrder: LevelId[] = ['novato', 'aprendiz', 'experto']

    const completedLevels = useGameStore((state) => state.user?.completedLevels || []);
    const currentLevelId = useGameStore((state) => state.progress.currentLevel) || 'novato';
    const currentIndex = levelOrder.indexOf(currentLevelId as LevelId);
    const totalLevels = levelOrder.length;
    const progressPercentage = (completedLevels.length / totalLevels) * 100;

    return (
        <MobileLayout title="" showHeader={false} showNavigation={false}>
            <div className="flex flex-col min-h-screen bg-master-bg pb-10">

                {/* HEADER SIMPLE */}
                <div className="flex items-center px-4 pt-6 pb-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-master-surface border border-master-border shadow-sm active:scale-90 transition-all"
                    >
                        <span className="text-xl text-master-text">←</span>
                    </button>
                    <div className="flex-1 text-center pr-10">
                        <h1 className="text-2xl font-black text-master-text tracking-tight">Seleccionar nivel</h1>
                        <p className="text-xs text-master-muted font-medium">Desbloquea nuevos desafíos mentales</p>
                    </div>
                </div>

                {/* CONTENIDO DE NIVELES */}
                <div className="px-6 space-y-6 mt-4">
                    <div className="grid gap-4">
                        {levelList.map((level, index) => {
                            // LÓGICA REAL DE ESTADOS
                            const isCompleted = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const isLocked = index > currentIndex;

                            return (
                                <Link
                                    key={level.id}
                                    // Solo permitimos el link si no está bloqueado
                                    to={isLocked ? '#' : `/game/${level.id}`}
                                    className={`relative flex items-center p-5 rounded-[2rem] border-2 transition-all active:scale-[0.98]
                                        ${isCurrent
                                            ? 'border-master-primary bg-white dark:bg-master-surface shadow-md'
                                            : isLocked
                                                ? 'border-transparent bg-gray-100 dark:bg-master-surface-strong opacity-60 grayscale cursor-not-allowed'
                                                : 'border-green-500/30 bg-green-50/30 dark:bg-green-900/10 shadow-sm'
                                        }`}
                                >
                                    {/* Número del nivel con cambio de color según estado */}
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black mr-4
                                        ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-master-primary text-white' : 'bg-master-border text-master-muted'}`}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>

                                    {/* Info del nivel */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-extrabold text-master-text">{level.label}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {isCompleted ? (
                                                <span className="bg-green-500/10 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Completado</span>
                                            ) : isLocked ? (
                                                <span className="text-master-muted text-xs font-medium">Completa el anterior</span>
                                            ) : (
                                                <span className="text-master-primary text-xs font-bold">{level.amount} Retos disponibles</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Iconos de estado dinámicos */}
                                    <div className="ml-2">
                                        {isLocked ? (
                                            <span className="text-2xl">🔒</span>
                                        ) : isCompleted ? (
                                            <div className="h-8 w-8 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500">
                                                ✓
                                            </div>
                                        ) : (
                                            <span className="text-2xl text-master-primary animate-pulse">▶</span>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* SECCIÓN DE RANGO/PROGRESO CON DATOS REALES */}
                    <div className="mt-8 p-6 rounded-[2.5rem] border-2 border-dashed border-master-primary/30 bg-master-primary/5 flex flex-col items-center gap-4 text-center">
                        <div className="h-10 w-10 bg-master-accent/20 rounded-full flex items-center justify-center text-xl">🎖️</div>
                        <div>
                            <h4 className="font-black text-master-text italic">
                                {progressPercentage === 100 ? '¡Eres un MindMaster!' : '¡Sigue así, vas por buen camino!'}
                            </h4>
                            <p className="text-[10px] text-master-muted font-bold uppercase tracking-widest mt-1">
                                Has desbloqueado el {Math.round(progressPercentage)}% del juego
                            </p>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full h-3 bg-master-border rounded-full overflow-hidden">
                            <div
                                className="h-full bg-master-primary shadow-neon transition-all duration-1000"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </MobileLayout>
    )
}