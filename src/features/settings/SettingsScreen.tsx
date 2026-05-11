import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdSettings, MdEdit, MdEmojiEvents, MdTrendingUp, MdDarkMode, MdLightMode, MdVolumeUp, MdVolumeOff, MdMusicNote, MdMusicOff, MdLogout, MdCheck, MdClose } from 'react-icons/md'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useGameStore } from '../../store/gameStore'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../services/firebase'
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'

export function SettingsScreen() {
    const navigate = useNavigate()
    const { signOut } = useAuth()

    const [isEditing, setIsEditing] = useState(false)
    const [newNick, setNewNick] = useState('')

    const settings = useGameStore((state) => state.settings)
    const user = useGameStore((state) => state.user)
    const userName = useGameStore((state) => state.userName)
    const progress = useGameStore((state) => state.progress)
    const setUser = useGameStore((state) => state.setUser)
    const setTheme = useGameStore((state) => state.setTheme)
    const toggleSound = useGameStore((state) => state.toggleSound)
    const toggleMusic = useGameStore((state) => state.toggleMusic)

    const isDarkMode = settings.theme === 'dark'

    useEffect(() => {
        if (!user) {
            const savedUser = localStorage.getItem('mm_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                navigate('/');
            }
        }
    }, [user, navigate, setUser]);

    const handleSaveName = async () => {
        const nameToSave = newNick.trim();
        if (!nameToSave || !user?.uid) {
            setIsEditing(false);
            return;
        }

        try {
            const usersRef = collection(db!, 'users');
            const q = query(usersRef, where('username', '==', nameToSave));
            const snapshot = await getDocs(q);

            const existingUser = snapshot.docs.find(docu => docu.id !== user.uid);
            if (existingUser) {
                alert('Ese nombre ya está en uso');
                return;
            }

            const updatedPhotoURL = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(nameToSave)}`;
            const userRef = doc(db!, 'users', user.uid);

            await updateDoc(userRef, {
                displayName: nameToSave,
                username: nameToSave,
                photoURL: updatedPhotoURL
            });

            const updatedUser = {
                ...user,
                displayName: nameToSave,
                username: nameToSave,
                photoURL: updatedPhotoURL
            };

            setUser(updatedUser);
            setIsEditing(false);

        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el nombre');
        }
    };

    return (
        <MobileLayout title="Perfil" subtitle="Tu cuenta y configuración" showHeader={false}>
            <header className="sticky top-0 z-40 flex w-full items-center justify-between px-2 py-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-master-muted transition-colors hover:bg-master-surface/50 active:scale-95"
                    >
                        <MdArrowBack />
                    </button>
                    <h1 className="text-3xl font-bold text-master-primary">MindMaster</h1>
                </div>
                <div className="flex items-center justify-center p-2 text-2xl text-master-primary/80">
                    <MdSettings />
                </div>
            </header>

            <div className="flex-grow space-y-6 pb-6 pt-2">
                <section className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="relative">
                        <div className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-master-accent/30 bg-master-surface">
                            <img
                                alt="Usuario"
                                className="h-full w-full object-cover"
                                src={user?.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(userName || 'User')}`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    autoFocus
                                    className="border-b-2 border-master-primary bg-transparent text-center text-xl font-bold text-master-text outline-none"
                                    value={newNick}
                                    onChange={(e) => setNewNick(e.target.value)}
                                    maxLength={15}
                                />
                                <button onClick={handleSaveName} className="text-green-500 text-2xl"><MdCheck /></button>
                                <button onClick={() => setIsEditing(false)} className="text-red-500 text-2xl"><MdClose /></button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-master-text">
                                    {userName || user?.displayName || 'Usuario'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setNewNick(userName || user?.displayName || '');
                                        setIsEditing(true);
                                    }}
                                    className="text-master-primary text-xl"
                                >
                                    <MdEdit />
                                </button>
                            </>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-xl border border-master-border bg-master-surface/50 p-4 text-center transition-colors">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100/20 text-3xl text-amber-500">
                            <MdEmojiEvents />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-master-muted">Récord Personal</p>
                        <p className="text-xl font-bold text-master-text">{user?.bestScore || 0} pts</p>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-xl border border-master-border bg-master-surface/50 p-4 text-center transition-colors">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-master-accent/20 text-3xl text-master-primary">
                            <MdTrendingUp />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-master-muted">Nivel Alcanzado</p>
                        <p className="text-xl font-bold capitalize text-master-text">{progress.currentLevel || 'Novato'}</p>
                    </div>
                </div>

                <section className="space-y-4 pt-4">
                    <h3 className="px-1 text-xl font-bold text-master-text">Configuración</h3>
                    <div className="overflow-hidden rounded-xl border border-master-border bg-master-surface/50">
                        <div className="flex cursor-pointer items-center justify-between border-b border-master-border p-4 transition-colors hover:bg-master-accent/5" onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-xl text-master-muted dark:bg-white/5">
                                    {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
                                </div>
                                <span className="font-semibold text-master-text">Modo oscuro</span>
                            </div>
                            <div className={`h-6 w-11 rounded-full transition-colors ${isDarkMode ? 'bg-master-primary' : 'bg-black/20 dark:bg-white/20'} relative`}>
                                <div className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                            </div>
                        </div>

                        <div className="flex cursor-pointer items-center justify-between border-b border-master-border p-4 transition-colors hover:bg-master-accent/5" onClick={toggleSound}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-xl text-master-muted dark:bg-white/5">
                                    {settings.soundEnabled ? <MdVolumeUp /> : <MdVolumeOff />}
                                </div>
                                <span className="font-semibold text-master-text">Efectos de sonido</span>
                            </div>
                            <div className={`h-6 w-11 rounded-full transition-colors ${settings.soundEnabled ? 'bg-master-primary' : 'bg-black/20 dark:bg-white/20'} relative`}>
                                <div className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                            </div>
                        </div>

                        <div className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-master-accent/5" onClick={toggleMusic}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-xl text-master-muted dark:bg-white/5">
                                    {settings.musicEnabled ? <MdMusicNote /> : <MdMusicOff />}
                                </div>
                                <span className="font-semibold text-master-text">Música de fondo</span>
                            </div>
                            <div className={`h-6 w-11 rounded-full transition-colors ${settings.musicEnabled ? 'bg-master-primary' : 'bg-black/20 dark:bg-white/20'} relative`}>
                                <div className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform ${settings.musicEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pt-4 pb-12">
                    <button
                        onClick={() => {
                            signOut();
                            navigate('/');
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl p-4 text-red-500 transition-colors hover:bg-red-500/10 font-bold text-xl"
                    >
                        <MdLogout />
                        <span>Cerrar Sesión</span>
                    </button>
                </section>
            </div>
        </MobileLayout>
    )
}