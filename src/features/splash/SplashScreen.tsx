import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useGameStore } from '../../store/gameStore'
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
import type { UserProfile } from '../../types/game'
import { auth, db } from '../../services/firebase'
import { signInAnonymously } from 'firebase/auth'

export function SplashScreen() {
    const [nick, setNick] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [welcomeMessage, setWelcomeMessage] = useState('')
    const [isReturningUser, setIsReturningUser] = useState(false)

    // Usamos setUser para guardar el objeto completo, no solo el nombre
    const setUser = useGameStore((s) => s.setUser)
    const navigate = useNavigate()

    async function handleStart() {
        console.log("DEBUG: Config de Firebase", {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
        });
        const cleanNick = nick.trim();
        if (!cleanNick) return;

        setLoading(true);
        setError('');

        try {
            // 1. Buscamos si el usuario ya existe
            const usersRef = collection(db!, 'users');
            const q = query(usersRef, where('username', '==', cleanNick));
            const querySnapshot = await getDocs(q);

            // --- CASO A: EL USUARIO YA EXISTE EN FIRESTORE ---
            if (!querySnapshot.empty) {
                setIsReturningUser(true)
                setWelcomeMessage(`¡Bienvenido de nuevo, ${cleanNick}!`)
                const existingDoc = querySnapshot.docs[0];
                const userData = existingDoc.data() as UserProfile;

                // Iniciamos sesión anónima para tener permisos
                await signInAnonymously(auth!);

                // Guardamos los datos que ya estaban en la nube en nuestro Store
                setUser({
                    uid: existingDoc.id,
                    displayName: userData.displayName,
                    photoURL:
                        userData.photoURL ||
                        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
                            userData.displayName
                        )}`,
                    coins: userData.coins || 100,
                    bestScore: userData.bestScore || 0,
                    completedLevels: userData.completedLevels || []
                });

                navigate('/home');
                return; // Terminamos aquí
            }

            // --- CASO B: USUARIO NUEVO ---
            const userCredential = await signInAnonymously(auth!);
            const firebaseUid = userCredential.user.uid;

            setIsReturningUser(false)
            setWelcomeMessage('Creando tu perfil...')
            const newUser: UserProfile = {
                uid: firebaseUid,
                displayName: cleanNick,
                photoURL: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(cleanNick)}`,
                coins: 100,
                bestScore: 0,
                completedLevels: []
            };

            // Guardamos en Firestore
            await setDoc(doc(db!, 'users', firebaseUid), {
                ...newUser,
                username: cleanNick,
                createdAt: new Date().toISOString()
            });

            setUser(newUser);
            navigate('/home');

        } catch (err: any) {
            console.error("Error en el registro/login:", err);
            setError('Error de conexión con Firebase. Revisa tu consola.');
            setLoading(false);
        }
    }

    return (
        <MobileLayout showNavigation={false} showHeader={false} title="">
            <div className="flex h-screen flex-col items-center justify-between px-10 pt-20 pb-16 bg-master-bg transition-colors duration-300">

                {/* SECCIÓN SUPERIOR: Logo y Títulos */}
                {/* SECCIÓN SUPERIOR: Logo y Títulos */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <img
                        src="/logo.png"
                        alt="MindMaster Logo"
                        className="h-32 w-32 object-cover mb-6 rounded-full border-master-accent/30 bg-master-surface shadow-neon"
                    />
                    <h1 className="text-5xl font-extrabold text-master-primary tracking-tight">MindMaster</h1>
                    <p className="text-xl text-master-muted font-medium text-center">Libera tu potencial mental</p>
                </div>

                {/* SECCIÓN INFERIOR: Input y Botón */}
                <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                    <div className="w-full p-6 rounded-[2rem] bg-master-surface shadow-app border border-master-border">
                        <label className="block text-sm font-bold text-master-text mb-4 text-center">
                            ¿Cómo te llamas?
                        </label>

                        <div className="relative">
                            <input
                                value={nick}
                                onChange={(e) => {
                                    setNick(e.target.value)
                                    setError('')
                                    setWelcomeMessage('')
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                                placeholder="Ingresa tu apodo..."
                                className="w-full rounded-xl bg-master-bg/50 px-4 py-4 text-lg font-semibold text-master-text border-2 border-transparent focus:border-master-primary outline-none transition-all placeholder:text-master-muted/50 text-center"
                                maxLength={15}
                            />
                        </div>

                        {error && (
                            <p className="mt-3 text-sm text-red-500 font-medium text-center">
                                {error}
                            </p>
                        )}

                        {welcomeMessage && (
                            <p className="mt-4 text-center text-master-primary font-semibold">
                                {welcomeMessage}

                                {isReturningUser && (
                                    <span className="block text-sm text-master-muted mt-1">
                                        Continuando tu progreso...
                                    </span>
                                )}
                            </p>
                        )}

                        <p className="mt-4 text-xs text-master-muted text-center">
                            Tu nombre aparecerá en el ranking mundial.
                        </p>
                    </div>

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
                </div>
            </div>
        </MobileLayout>
    )
}