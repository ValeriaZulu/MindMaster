import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

type MobileLayoutProps = {
    title: string
    subtitle?: string
    showNavigation?: boolean
    children: ReactNode
}

const navItems = [
    { to: '/home', label: 'Home' },
    { to: '/levels', label: 'Niveles' },
    { to: '/ranking', label: 'Ranking' },
    { to: '/settings', label: 'Ajustes' },
]

export function MobileLayout({ title, subtitle, showNavigation = true, children }: MobileLayoutProps) {
    return (
        <main className="min-h-screen bg-master-bg px-4 py-4 text-master-text sm:px-6">
            <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-master-border bg-master-surface shadow-[var(--app-shadow)] backdrop-blur-xl">
                <header className="flex items-center justify-between border-b border-master-border px-5 py-4">
                    <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-master-muted">MindMaster</p>
                        <h1 className="text-2xl font-bold text-master-primary">{title}</h1>
                        {subtitle ? <p className="mt-1 text-sm text-master-muted">{subtitle}</p> : null}
                    </div>
                    <Link className="rounded-full border border-master-border bg-master-surface-strong px-4 py-2 text-sm font-semibold text-master-primary" to="/home">
                        Inicio
                    </Link>
                </header>

                <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

                {showNavigation ? (
                    <nav className="grid grid-cols-4 gap-2 border-t border-master-border bg-master-surface-strong px-3 py-3 text-center text-xs font-semibold text-master-muted">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                className={({ isActive }) =>
                                    [
                                        'rounded-2xl px-2 py-3 transition',
                                        isActive ? 'bg-master-primary text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5',
                                    ].join(' ')
                                }
                                to={item.to}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                ) : null}
            </section>
        </main>
    )
}
