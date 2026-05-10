import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { CoinDisplay } from '../../components/ui/CoinDisplay'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { useGameStore } from '../../store/gameStore'
import { useAuth } from '../../hooks/useAuth'

export function HomeScreen() {
    const userName = useGameStore((state) => state.userName)
    const coins = useGameStore((state) => state.coins)
    const { signIn, loading } = useAuth()
    const [draftName, setDraftName] = useState(userName)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await signIn(draftName)
    }

    return (
        <MobileLayout title="Inicio" subtitle="Pantalla principal de MindMaster">
            <div className="space-y-4">
                <CoinDisplay className="w-fit" coins={coins} />

                <ScreenCard title={`Hola, ${userName || 'Usuario'}`} description="Ingresa tu nombre para crear tu sesión anónima y comenzar con 100 monedas de regalo.">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="rounded-2xl border border-master-border bg-master-surface px-4 py-3 shadow-sm">
                            <label className="text-sm font-semibold text-master-muted" htmlFor="username">
                                Nombre de usuario
                            </label>
                            <input
                                className="mt-2 w-full bg-transparent text-lg font-semibold text-master-text outline-none placeholder:text-master-muted"
                                id="username"
                                maxLength={20}
                                onChange={(event) => setDraftName(event.target.value)}
                                placeholder="Ingresa tu apodo..."
                                value={draftName}
                            />
                        </div>
                        <button className="w-full rounded-2xl bg-master-primary px-4 py-4 font-semibold text-white disabled:opacity-70" disabled={loading} type="submit">
                            {loading ? 'Conectando...' : 'Entrar con nombre'}
                        </button>
                    </form>
                </ScreenCard>

                <ScreenCard title="Estado rápido" description="La persistencia local y el ranking quedarán sincronizados más adelante con Firestore.">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                            <p className="text-sm text-master-muted">Monedas</p>
                            <p className="mt-1 text-2xl font-bold text-master-primary">{coins}</p>
                        </div>
                        <div className="rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                            <p className="text-sm text-master-muted">Modo</p>
                            <p className="mt-1 text-2xl font-bold text-master-primary">Mobile</p>
                        </div>
                    </div>
                </ScreenCard>

                <div className="grid grid-cols-2 gap-3">
                    <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/levels">
                        Jugar
                    </Link>
                    <Link className="rounded-2xl border border-master-border bg-master-surface-strong px-4 py-4 text-center font-semibold text-master-primary" to="/ranking">
                        Ranking
                    </Link>
                </div>
            </div>
        </MobileLayout>
    )
}
