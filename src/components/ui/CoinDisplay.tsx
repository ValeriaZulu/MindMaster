type CoinDisplayProps = {
    coins: number
    className?: string
}

export function CoinDisplay({ coins, className = '' }: CoinDisplayProps) {
    return (
        <div
            className={[
                'inline-flex items-center gap-2 rounded-full border border-master-border',
                'bg-master-surface-strong px-3 py-1.5 text-sm font-semibold text-master-primary',
                className,
            ].join(' ')}
        >
            <span aria-hidden="true">◉</span>
            <span>{coins} monedas</span>
        </div>
    )
}
