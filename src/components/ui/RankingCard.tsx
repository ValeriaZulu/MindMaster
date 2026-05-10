type RankingCardProps = {
    rank: number
    name: string
    score: number
    isCurrentUser: boolean
}

export function RankingCard({ rank, name, score, isCurrentUser }: RankingCardProps) {
    return (
        <div
            className={[
                'flex items-center justify-between rounded-2xl border px-4 py-3 transition',
                isCurrentUser
                    ? 'border-master-accent bg-master-accent/20 shadow-[0_0_20px_rgba(105,240,174,0.35)]'
                    : 'border-master-border bg-black/5 dark:bg-white/5',
            ].join(' ')}
        >
            <p className="font-semibold text-master-text">{rank}. {name}</p>
            <p className="font-semibold text-master-primary">{score}</p>
        </div>
    )
}
