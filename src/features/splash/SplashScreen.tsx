import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useGameStore } from '../../store/gameStore'
import { db } from '../../services/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export function SplashScreen() {
    const [nick, setNick] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const setUserName = useGameStore((s) => s.setUserName)
    const navigate = useNavigate()

    async function handleStart() {
        if (!nick.trim()) return;

        setLoading(true);
        setError('');

        try {
            // Validación de nombre único en Firestore
            const usersRef = collection(db!, 'users');
            const q = query(usersRef, where('username', '==', nick.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Este apodo ya existe. ¡Prueba otro!');
                setLoading(false);
                return;
            }

            // Si es único, guardamos y avanzamos
            setUserName(nick.trim());
            navigate('/home');
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
            setLoading(false);
        }
    }

    return (
        <MobileLayout showNavigation={false} showHeader={false} title="">
            {/* Contenedor principal con alto fijo (h-screen) para evitar scroll y justify-between para separar top y bottom */}
            <div className="flex h-screen flex-col items-center justify-between px-10 pt-20 pb-16 bg-master-bg transition-colors duration-300">

                {/* SECCIÓN SUPERIOR: Logo y Títulos */}
                <div className="flex flex-col items-center gap-4 w-full">
                    {/* Logo Limpio (sin círculo ni bombillo) */}
                    <img
                        src="/logo.png"
                        alt="MindMaster Logo"
                        className="h-32 w-32 object-contain mb-6"
                    />

                    {/* Títulos */}
                    <h1 className="text-5xl font-extrabold text-master-primary tracking-tight">MindMaster</h1>
                    <p className="text-xl text-master-muted font-medium text-center">Libera tu potencial mental</p>
                </div>

                {/* SECCIÓN INFERIOR: Input y Botón (agrupados para que queden abajo) */}
                <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                    {/* Input Card Estilizado (Gaming Style) */}
                    <div className="w-full p-6 rounded-[2rem] bg-master-surface shadow-app border border-master-border">
                        <label className="block text-sm font-bold text-master-text mb-4 text-center">¿Cómo te llamas?</label>
                        <div className="relative">
                            <input
                                value={nick}
                                onChange={(e) => {
                                    setNick(e.target.value);
                                    setError('');
                                }}
                                placeholder="Ingresa tu apodo..."
                                className="w-full rounded-xl bg-master-bg/50 px-4 py-4 text-lg font-semibold text-master-text border-2 border-transparent focus:border-master-primary outline-none transition-all placeholder:text-master-muted/50 text-center"
                                maxLength={15}
                            />
                        </div>
                        {error && <p className="mt-3 text-sm text-red-500 font-medium text-center">{error}</p>}
                        <p className="mt-4 text-xs text-master-muted text-center">Tu nombre aparecerá en el ranking mundial.</p>
                    </div>

                    {/* Botón de Acción destacado */}
                    <button
                        onClick={handleStart}
                        disabled={!nick.trim() || loading}
                        className={`group w-full rounded-2xl py-4 text-xl font-bold text-white transition-all flex items-center justify-center gap-3
                            ${!nick.trim() || loading
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-master-primary hover:scale-[1.02] shadow-neon active:scale-95'
                            }`}
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="text-2xl">▶</span>
                                <span>Comenzar</span>
                            </>
                        )}
                    </button>

                    {/* Eliminamos el footer de Español/Ayuda */}
                </div>

            </div>
        </MobileLayout>
    )
}