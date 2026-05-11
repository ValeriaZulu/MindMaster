import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

type MobileLayoutProps = {
    title: string
    subtitle?: string
    showNavigation?: boolean
    showHeader?: boolean
    children: ReactNode
}

const navItems = [
    { to: '/Home', label: 'Jugar', icon: 'play' },
    { to: '/ranking', label: 'Ranking', icon: 'trophy' },
    { to: '/profile', label: 'Perfil', icon: 'user' },
]

export function MobileLayout({ title, subtitle, showNavigation = true, showHeader = true, children }: MobileLayoutProps) {
    return (
        <main className="min-h-screen bg-master-bg px-4 py-4 text-master-text sm:px-6">
            <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-master-border bg-master-surface shadow-[var(--app-shadow)] backdrop-blur-xl">
                {showHeader ? (
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
                ) : null}

                <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

                {showNavigation ? (
                    <nav className="grid grid-cols-3 gap-2 border-t border-master-border bg-master-surface-strong px-3 py-3 text-center text-xs font-semibold text-master-muted">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                className={({ isActive }) =>
                                    [
                                        'flex items-center justify-center gap-2 rounded-2xl px-2 py-3 transition',
                                        isActive ? 'bg-master-primary text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5',
                                    ].join(' ')
                                }
                                to={item.to}
                            >
                                {/* Inline simple icons */}
                                {item.icon === 'play' ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
                                    </svg>
                                ) : item.icon === 'trophy' ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 3H7v2a4 4 0 00-4 4v1a3 3 0 003 3h1v3a3 3 0 003 3h2a3 3 0 003-3v-3h1a3 3 0 003-3V9a4 4 0 00-4-4V3z" fill="currentColor" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z" fill="currentColor" />
                                    </svg>
                                )}
                                <span className="text-sm">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                ) : null}
            </section>
        </main>
    )
}
