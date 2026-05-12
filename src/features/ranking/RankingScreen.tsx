import { MobileLayout } from '../../components/layout/MobileLayout'
import { useRanking } from '../../hooks/useRanking'
import { useGameStore } from '../../store/gameStore'
import { MdLeaderboard } from 'react-icons/md'

export function RankingScreen() {
    const currentUser = useGameStore((state) => state.user)
    const { ranking, isLoading, error } = useRanking()

    const top1 = ranking[0]
    const top2 = ranking[1]
    const top3 = ranking[2]
    const others = ranking.slice(3)

    const currentUserIndex = ranking.findIndex(r => r.uid === currentUser?.uid)
    const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : '-'

    const getAvatar = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`

    return (
        <MobileLayout
            showHeader={false} // Desactivamos el header por defecto para hacer el nuestro
            title="Ranking"
        >
            {/* Cabecera Personalizada Centrada */}
            <header className="relative flex flex-col items-center justify-center py-8 px-4">
                {/* Icono decorativo de fondo (opcional, para que no empuje el texto) */}
                <MdLeaderboard className="absolute left-6 top-10 text-4xl text-master-primary/10 rotate-12" />

                <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-master-primary/70 mb-1">
                    MindMaster
                </h1>

                <div className="text-center">
                    <h2 className="text-4xl font-black text-master-text leading-tight">
                        Ranking <br />
                        <span className="text-master-primary">Mundial</span>
                    </h2>
                </div>

                <p className="mt-2 text-xs font-medium text-master-muted text-center italic">
                    "Compite con las mentes más brillantes"
                </p>
            </header>

            <div className="space-y-6 pb-6">
                {error ? (
                    <p className="rounded-xl bg-amber-100/80 px-3 py-2 text-sm font-semibold text-amber-900 text-center">
                        {error}
                    </p>
                ) : null}
                {/* Podium */}
                {ranking.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 items-end">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center">
                            {top2 ? (
                                <>
                                    <div className="relative mb-2">
                                        <div className="w-16 h-16 rounded-full border-4 border-slate-300 p-0.5 bg-white">
                                            <img alt={top2.displayName} className="w-full h-full rounded-full" src={top2.photoURL || getAvatar(top2.displayName)} />
                                        </div>
                                        <div className="absolute -top-2 -right-1 bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                            <span className="text-[12px] font-bold text-slate-600">2</span>
                                        </div>
                                    </div>
                                    <div className="bg-master-surface-strong rounded-xl p-2 w-full text-center shadow-sm border-b-4 border-slate-300">
                                        <p className="text-xs font-bold text-master-text truncate">{top2.displayName}</p>
                                        <p className="text-xs font-semibold text-master-primary">{top2.bestScore}</p>
                                    </div>
                                </>
                            ) : <div className="h-28" />}
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center">
                            {top1 ? (
                                <>
                                    <div className="relative mb-2">
                                        <div className="w-20 h-20 rounded-full border-4 border-amber-400 p-1 bg-white scale-110 z-10 relative">
                                            <img alt={top1.displayName} className="w-full h-full rounded-full" src={top1.photoURL || getAvatar(top1.displayName)} />
                                        </div>
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-400 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                            <span className="text-[12px] font-bold text-amber-900">1</span>
                                        </div>
                                    </div>
                                    <div className="bg-master-surface-strong rounded-xl p-2 w-full text-center shadow-sm border-b-4 border-amber-400 relative z-10">
                                        <p className="text-xs font-bold text-master-text truncate">{top1.displayName}</p>
                                        <p className="text-sm font-bold text-amber-500">{top1.bestScore}</p>
                                    </div>
                                </>
                            ) : <div className="h-32" />}
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center">
                            {top3 ? (
                                <>
                                    <div className="relative mb-2">
                                        <div className="w-16 h-16 rounded-full border-4 border-amber-600 p-0.5 bg-white">
                                            <img alt={top3.displayName} className="w-full h-full rounded-full" src={top3.photoURL || getAvatar(top3.displayName)} />
                                        </div>
                                        <div className="absolute -top-2 -right-1 bg-amber-100 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                            <span className="text-[12px] font-bold text-amber-700">3</span>
                                        </div>
                                    </div>
                                    <div className="bg-master-surface-strong rounded-xl p-2 w-full text-center shadow-sm border-b-4 border-amber-600">
                                        <p className="text-xs font-bold text-master-text truncate">{top3.displayName}</p>
                                        <p className="text-xs font-semibold text-master-primary">{top3.bestScore}</p>
                                    </div>
                                </>
                            ) : <div className="h-28" />}
                        </div>
                    </div>
                )}

                {/* Scrollable List */}
                {others.length > 0 && (
                    <div className="space-y-3 mt-4">
                        {others.map((entry, index) => {
                            const rank = index + 4
                            const isCurrent = entry.uid === currentUser?.uid
                            return (
                                <div key={entry.uid} className={`p-3 rounded-xl flex items-center gap-3 shadow-sm transition-colors ${isCurrent ? 'bg-master-primary/10 border border-master-primary/30' : 'bg-master-surface-strong hover:bg-black/5 dark:bg-white/5'}`}>
                                    <span className="text-lg font-bold text-master-muted w-6 text-center">{rank}.</span>
                                    <img alt={entry.displayName} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5" src={entry.photoURL || getAvatar(entry.displayName)} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-master-text truncate">{entry.displayName}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 pl-2">
                                        <p className="font-bold text-master-primary">{entry.bestScore}</p>
                                        <p className="text-[10px] font-bold text-master-muted uppercase">pts</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {!isLoading && ranking.length === 0 ? (
                    <p className="rounded-xl bg-black/5 px-4 py-3 text-sm text-master-muted dark:bg-white/5 text-center">
                        Aún no hay puntajes para mostrar.
                    </p>
                ) : null}

                {/* Current User Highlight */}
                {currentUser && (
                    <div className="bg-master-primary p-3 rounded-xl flex items-center gap-3 shadow-[0_4px_16px_rgba(109,40,255,0.4)] ring-2 ring-master-surface relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 opacity-50" />
                        <span className="text-lg font-bold text-white w-6 text-center relative z-10">{currentUserRank}.</span>
                        <img alt={currentUser.displayName} className="w-10 h-10 rounded-full bg-white/20 relative z-10 border border-white/50 min-w-10" src={currentUser.photoURL || getAvatar(currentUser.displayName)} />
                        <div className="flex-1 min-w-0 relative z-10">
                            <p className="font-bold text-white truncate">Tú ({currentUser.displayName})</p>
                            <p className="text-[10px] font-semibold text-white/80 uppercase">Tu posición</p>
                        </div>
                        <div className="text-right relative z-10 flex-shrink-0 pl-2">
                            <p className="font-bold text-white text-lg">{currentUser.bestScore}</p>
                            <p className="text-[10px] font-bold text-white/80 uppercase">pts</p>
                        </div>
                    </div>
                )}
            </div>
        </MobileLayout>
    )
}
