type PowerUpButtonProps = {
    label: string
    cost: number
    disabled?: boolean
    onClick: () => void
}

export function PowerUpButton({ label, cost, disabled = false, onClick }: PowerUpButtonProps) {
    return (
        <button
            className={[
                'rounded-2xl border px-3 py-3 text-sm font-semibold transition',
                disabled
                    ? 'cursor-not-allowed border-master-border/50 bg-black/5 text-master-muted dark:bg-white/5'
                    : 'border-master-border bg-master-surface-strong text-master-primary hover:scale-[1.02] hover:shadow-[0_0_18px_rgba(109,40,255,0.35)]',
            ].join(' ')}
            disabled={disabled}
            onClick={onClick}
            type="button"
        >
            <span>{label}</span>
            <span className="ml-2 rounded-full bg-master-accent/20 px-2 py-0.5 text-xs">{cost} monedas</span>
        </button>
    )
}
