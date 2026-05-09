import type { ReactNode } from 'react'

type ScreenCardProps = {
    title: string
    description?: string
    children?: ReactNode
}

export function ScreenCard({ title, description, children }: ScreenCardProps) {
    return (
        <section className="rounded-[1.75rem] border border-master-border bg-master-surface-strong p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-master-primary">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-master-muted">{description}</p> : null}
            {children ? <div className="mt-4">{children}</div> : null}
        </section>
    )
}
