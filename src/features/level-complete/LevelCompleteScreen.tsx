import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { buildRewardSignature, hasRewardBeenGranted, markRewardGranted, useEconomy } from '../../hooks/useEconomy'
import { useSound } from '../../hooks/useSound'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'
import { useGameStore } from '../../store/gameStore'
import confetti from 'canvas-confetti';

export function LevelCompleteScreen() {
    const params = useParams()
    const navigate = useNavigate()
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? params.levelId : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]
    const user = useGameStore((state) => state.user)
    const progress = useGameStore((state) => state.progress)
    const { addCoins } = useEconomy()
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
        let isMounted = true;

        async function grantReward() {
            if (hasRewardBeenGranted(rewardSignature)) {
                if (isMounted) setRewardGranted(true);
                return;
            }
            try {
                await addCoins(level.rewardCoins);
                playEffect('complete');
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6D4AFF', '#007A43', '#FFD700']
                });
                markRewardGranted(rewardSignature);
                if (isMounted) setRewardGranted(true);
            } catch (error) {
                console.error("Error al dar recompensa:", error);
            }
        }

        grantReward();
        return () => { isMounted = false; };
    }, [rewardSignature, level.rewardCoins]);

    return (
        <div className="min-h-screen bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden p-8 flex flex-col items-center text-center shadow-2xl"
            >
                {/* Espacio para el trofeo (omitido por ahora) */}
                <div className="w-48 h-48 mb-6 flex items-center justify-center">
                    <span className="text-6xl">🏆</span>
                </div>

                {/* Título y Mensaje */}
                <h1 className="text-[#6D4AFF] text-4xl font-black mb-2 leading-tight">
                    ¡Nivel<br />completado!
                </h1>
                <p className="text-gray-500 text-sm font-medium px-4 mb-8">
                    ¡Excelente trabajo! Has demostrado un gran dominio en esta categoría.
                </p>

                {/* Card de Recompensa */}
                <div className="w-full bg-[#E8FFF3] rounded-3xl p-6 flex items-center gap-4 mb-8 border border-[#BFFFD9]">
                    <div className="bg-[#007A43] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">🪙</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[#007A43] text-[10px] font-black uppercase tracking-wider leading-none mb-1">
                            Recompensa
                        </p>
                        <p className="text-[#007A43] text-2xl font-black leading-none">
                            {rewardGranted ? `+ ${level.rewardCoins}` : '...'} monedas
                        </p>
                    </div>
                </div>

                {/* Botón Principal */}
                <button
                    onClick={() => navigate('/levels')}
                    className="w-full bg-[#6D4AFF] text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-200 active:scale-95 transition-transform mb-6"
                >
                    Siguiente Nivel
                    <span className="text-2xl">→</span>
                </button>

                {/* Enlace Volver */}
                <Link
                    to="/levels"
                    className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                    Volver al menú
                </Link>
            </motion.div>
        </div>
    )
}