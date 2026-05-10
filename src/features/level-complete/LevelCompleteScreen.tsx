import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { CoinDisplay } from '../../components/ui/CoinDisplay'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { buildRewardSignature, hasRewardBeenGranted, markRewardGranted, useEconomy } from '../../hooks/useEconomy'
import { useSound } from '../../hooks/useSound'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'
import { useGameStore } from '../../store/gameStore'

export function LevelCompleteScreen() {
    const params = useParams()
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? params.levelId : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]
    const user = useGameStore((state) => state.user)
    const progress = useGameStore((state) => state.progress)
    const { coins, addCoins } = useEconomy()
    const { playEffect } = useSound()
    const [rewardGranted, setRewardGranted] = useState(false)

    const rewardSignature = useMemo(
        () =>
            buildRewardSignature({
                uid: user?.uid ?? null,
                levelId,
                score: progress.score,
                correctAnswers: progress.correctAnswers,
                secondsRemaining: progress.secondsRemaining,
            }),
        [levelId, progress.correctAnswers, progress.score, progress.secondsRemaining, user?.uid],
    )

    useEffect(() => {
        let isMounted = true

        async function grantReward() {
            if (hasRewardBeenGranted(rewardSignature)) {
                if (isMounted) {
                    setRewardGranted(true)
                }

                return
            }

            await addCoins(level.rewardCoins)
            playEffect('complete')
            markRewardGranted(rewardSignature)

            if (isMounted) {
                setRewardGranted(true)
            }
        }

        void grantReward()

        return () => {
            isMounted = false
        }
    }, [addCoins, level.rewardCoins, playEffect, rewardSignature])

    return (
        <MobileLayout title="Nivel completado" subtitle={level.label}>
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
                initial={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.35 }}
            >
                <CoinDisplay className="w-fit" coins={coins} />

                <ScreenCard title="Buen trabajo" description="Esta pantalla más adelante mostrará recompensa, animación de victoria y siguiente paso.">
                    <div className="space-y-3">
                        <div className="rounded-2xl bg-master-accent/20 p-4 text-center font-semibold text-master-text">
                            {rewardGranted ? `Recompensa aplicada: +${level.rewardCoins} monedas` : 'Aplicando recompensa...'}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
                                <p className="text-master-muted">Puntaje</p>
                                <p className="font-semibold text-master-primary">{progress.score}</p>
                            </div>
                            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
                                <p className="text-master-muted">Aciertos</p>
                                <p className="font-semibold text-master-primary">{progress.correctAnswers}</p>
                            </div>
                            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5">
                                <p className="text-master-muted">Vidas</p>
                                <p className="font-semibold text-master-primary">{progress.lives}</p>
                            </div>
                        </div>
                    </div>
                </ScreenCard>
                <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/levels">
                    Volver a niveles
                </Link>
            </motion.div>
        </MobileLayout>
    )
}
