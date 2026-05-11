import type { ReactNode } from 'react'

type ScreenCardProps = {
    title: string
    description?: string
    children?: ReactNode
}

export function ScreenCard({ title, description, children }: ScreenCardProps) {
    return (
        <section className="rounded-[1.75rem] border border-master-primary-strong bg-gradient-to-br from-white/90 via-[rgba(109,40,255,0.03)] to-white/90 p-5 shadow-neon dark:bg-master-surface-strong dark:border-master-border">
            <h2 className="text-lg font-semibold text-master-primary">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-master-muted">{description}</p> : null}
            {children ? <div className="mt-4">{children}</div> : null}
        </section>
    )
}
