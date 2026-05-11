import { motion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { TRIVIA_LEVELS } from '../../hooks/useTrivia'
import { useGameStore } from '../../store/gameStore'

export function LevelFailedScreen() {
    const params = useParams()
    const navigate = useNavigate()
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? params.levelId : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]
    const progress = useGameStore((state) => state.progress)

    return (
        <div className="min-h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden p-8 flex flex-col items-center text-center shadow-2xl"
            >
                {/* Icono de Derrota */}
                <div className="w-48 h-48 mb-6 flex items-center justify-center bg-red-50 rounded-full">
                    <span className="text-6xl animate-bounce">💔</span>
                </div>

                {/* Título y Mensaje */}
                <h1 className="text-[#FF4A4A] text-4xl font-black mb-2 leading-tight">
                    ¡Casi lo<br />logras!
                </h1>
                <p className="text-gray-500 text-sm font-medium px-4 mb-8">
                    Te quedaste sin vidas esta vez, pero la práctica hace al maestro. ¿Quieres volver a intentarlo?
                </p>

                {/* Estadísticas Rápidas (Opcional, para que el usuario vea su progreso) */}
                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">Aciertos</p>
                        <p className="text-gray-800 text-xl font-black">{progress.correctAnswers}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">Nivel</p>
                        <p className="text-gray-800 text-xl font-black">{level.label}</p>
                    </div>
                </div>

                {/* Botón Principal: Reintentar */}
                <button
                    onClick={() => navigate(`/game/${levelId}`)}
                    className="w-full bg-[#FF4A4A] text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-2 shadow-lg shadow-red-200 active:scale-95 transition-transform mb-6"
                >
                    Reintentar
                    <span className="text-2xl">↻</span>
                </button>

                {/* Enlace Volver */}
                <Link
                    to="/levels"
                    className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                    Salir al menú
                </Link>
            </motion.div>
        </div>
    )
}