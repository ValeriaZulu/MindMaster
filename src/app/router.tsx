import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'

type ShellScreenProps = {
    title: string
    description: string
    accentLabel: string
}

function ShellScreen({ title, description, accentLabel }: ShellScreenProps) {
    const userName = useGameStore((state) => state.userName)

    return (
        <main className="min-h-screen bg-master-bg px-4 py-6 text-master-text">
            <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-between rounded-[2rem] border border-master-border bg-master-surface p-6 shadow-[var(--app-shadow)] backdrop-blur-xl">
                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-master-muted">
                            {accentLabel}
                        </p>
                        <h1 className="text-3xl font-bold text-master-primary">{title}</h1>
                        <p className="text-sm leading-6 text-master-muted">{description}</p>
                    </div>

                    <div className="rounded-[1.75rem] border border-master-border bg-master-surface-strong p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-master-muted">
                            Estado inicial
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                                <p className="text-master-muted">Usuario</p>
                                <p className="mt-1 font-semibold text-master-text">{userName || 'Sin nombre'}</p>
                            </div>
                            <div className="rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                                <p className="text-master-muted">Vidas</p>
                                <p className="mt-1 font-semibold text-master-text">3</p>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="grid grid-cols-2 gap-3 pt-6 text-sm font-semibold">
                    <Link className="rounded-full border border-master-border bg-master-surface-strong px-4 py-3 text-center text-master-primary shadow-sm transition hover:scale-[1.01]" to="/home">
                        Home
                    </Link>
                    <Link className="rounded-full border border-master-border bg-master-surface-strong px-4 py-3 text-center text-master-primary shadow-sm transition hover:scale-[1.01]" to="/levels">
                        Niveles
                    </Link>
                </nav>
            </section>
        </main>
    )
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/splash" />} />
                <Route
                    path="/splash"
                    element={
                        <ShellScreen
                            accentLabel="MindMaster"
                            title="Setup inicial listo"
                            description="La app ya tiene una base móvil, temática futurista, router y estado global preparado para crecer por fases."
                        />
                    }
                />
                <Route
                    path="/home"
                    element={
                        <ShellScreen
                            accentLabel="Home"
                            title="Pantalla base"
                            description="Aquí después vivirá el menú principal con acceso a jugar, ranking, configuración y créditos."
                        />
                    }
                />
                <Route
                    path="/levels"
                    element={
                        <ShellScreen
                            accentLabel="Levels"
                            title="Selección de niveles"
                            description="En esta fase sólo dejamos el contenedor listo para los 3 niveles, su progreso y sus recompensas."
                        />
                    }
                />
                <Route path="*" element={<Navigate replace to="/splash" />} />
            </Routes>
        </BrowserRouter>
    )
}