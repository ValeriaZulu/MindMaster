import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdSettings, MdEdit, MdEmojiEvents, MdTrendingUp, MdDarkMode, MdLightMode, MdVolumeUp, MdVolumeOff, MdMusicNote, MdMusicOff, MdLogout } from 'react-icons/md'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useGameStore } from '../../store/gameStore'
import { useAuth } from '../../hooks/useAuth'

export function SettingsScreen() {
    const navigate = useNavigate()
    const { signOut } = useAuth()

    const settings = useGameStore((state) => state.settings)
    const user = useGameStore((state) => state.user)
    const progress = useGameStore((state) => state.progress)

    const toggleSound = useGameStore((state) => state.toggleSound)
    const toggleMusic = useGameStore((state) => state.toggleMusic)
    const setTheme = useGameStore((state) => state.setTheme)

    const isDarkMode = settings.theme === 'dark'

    return (
        <MobileLayout title="Perfil" subtitle="Tu cuenta y configuración" showHeader={false}>
            {/* Header como el wireframe */}
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
                <div className="flex items-center gap-1">
                    <div className="flex items-center justify-center p-2 text-2xl text-master-primary/80">
                        <MdSettings />
                    </div>
                </div>
            </header>

            <div className="flex-grow space-y-6 pb-6 pt-2">
                {/* Profile Section */}
                <section className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="relative">
                        <div className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-4 border-master-accent/30 bg-master-surface">
                            <img
                                alt="Usuario"
                                className="h-full w-full object-cover"
                                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.displayName || 'User')}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                <MdEdit className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-master-text">{user?.displayName || 'Usuario'}</h2>
                        <button className="text-master-primary"><MdEdit /></button>
                    </div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="group flex flex-col items-center justify-center space-y-2 rounded-xl border border-master-border bg-master-surface/50 p-4 text-center transition-colors hover:bg-master-accent/10">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100/20 text-3xl text-amber-500">
                            <MdEmojiEvents />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-master-muted">Récord Personal</p>
                        <p className="text-xl font-bold text-master-text">{user?.bestScore || 0} pts</p>
                    </div>
                    <div className="group flex flex-col items-center justify-center space-y-2 rounded-xl border border-master-border bg-master-surface/50 p-4 text-center transition-colors hover:bg-master-accent/10">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-master-accent/20 text-3xl text-master-primary">
                            <MdTrendingUp />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-master-muted">Nivel Alcanzado</p>
                        <p className="text-xl font-bold capitalize text-master-text">{progress.currentLevel || 'Novato'}</p>
                    </div>
                </div>

                {/* Configuration Section */}
                <section className="space-y-4 pt-4">
                    <h3 className="px-1 text-xl font-bold text-master-text">Configuración</h3>
                    <div className="overflow-hidden rounded-xl border border-master-border bg-master-surface/50">

                        {/* Tema Toggle */}
                        <div
                            className="flex cursor-pointer items-center justify-between border-b border-master-border p-4 transition-colors hover:bg-master-accent/5"
                            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-xl text-master-muted dark:bg-white/5">
                                    {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
                                </div>
                                <span className="font-semibold text-master-text">Modo oscuro</span>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="peer sr-only" checked={isDarkMode} onChange={() => setTheme(isDarkMode ? 'light' : 'dark')} />
                                <div className="peer h-6 w-11 rounded-full bg-black/20 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-master-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:bg-white/20"></div>
                            </label>
                        </div>

                        {/* Sonido Toggle */}
                        <div
                            className="flex cursor-pointer items-center justify-between border-b border-master-border p-4 transition-colors hover:bg-master-accent/5"
                            onClick={toggleSound}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-xl text-master-muted dark:bg-white/5">
                                    {settings.soundEnabled ? <MdVolumeUp /> : <MdVolumeOff />}
                                </div>
                                <span className="font-semibold text-master-text">Efectos de sonido</span>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="peer sr-only" checked={settings.soundEnabled} onChange={toggleSound} />
                                <div className="peer h-6 w-11 rounded-full bg-black/20 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-master-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:bg-white/20"></div>
                            </label>
                        </div>

                        {/* Music Toggle */}
                        <div
                            className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-master-accent/5"
                            onClick={toggleMusic}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-xl text-master-muted dark:bg-white/5">
                                    {settings.musicEnabled ? <MdMusicNote /> : <MdMusicOff />}
                                </div>
                                <span className="font-semibold text-master-text">Música de fondo</span>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="peer sr-only" checked={settings.musicEnabled} onChange={toggleMusic} />
                                <div className="peer h-6 w-11 rounded-full bg-black/20 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-master-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:bg-white/20"></div>
                            </label>
                        </div>

                    </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-4 pb-12">
                    <button
                        type="button"
                        onClick={() => {
                            signOut()
                            navigate('/')
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl p-4 text-red-500 transition-colors hover:bg-red-500/10"
                    >
                        <MdLogout className="text-xl" />
                        <span className="text-xl font-bold">Cerrar Sesión</span>
                    </button>
                </section>
            </div>
        </MobileLayout>
    )
}
