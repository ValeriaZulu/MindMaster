import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdPerson, MdSchool, MdCode, MdStorage } from 'react-icons/md'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { useState } from 'react'
import confetti from 'canvas-confetti'

export function CreditsScreen() {
    const navigate = useNavigate()
    const [logoClicks, setLogoClicks] = useState(0)
    const [secretFound, setSecretFound] = useState(false)

    const handleLogoClick = () => {
        if (secretFound) return;

        // Usamos una variable local para la lógica inmediata
        const currentClicks = logoClicks + 1;
        setLogoClicks(currentClicks);

        if (currentClicks >= 5) {
            setSecretFound(true);
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    };

    return (
        <MobileLayout title="Créditos" showHeader={false}>
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 flex w-full items-center justify-between px-2 py-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-master-muted transition-colors hover:bg-master-surface/50 active:scale-95"
                    >
                        <MdArrowBack />
                    </button>

                    <h1 className="text-3xl font-bold text-master-primary">
                        MindMaster
                    </h1>
                </div>
                <div className="flex items-center justify-center p-2 text-2xl text-master-primary/80">
                    👥
                </div>
            </header>
            <div className="flex-grow space-y-6 px-1 pb-10 pt-4">
                <div className="flex flex-col items-center gap-3">
                    <div
                        onClick={handleLogoClick}
                        className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-master-border bg-master-surface shadow-sm transition-transform active:scale-95 shadow-neon" style={{ transform: `rotate(${logoClicks * 10}deg)` }}
                    >
                        <img
                            src="/logo.png"
                            alt="MindMaster Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-master-primary">MindMaster</h1>
                        <p className="mt-1 text-sm font-medium text-master-muted text-balance mt-2">Proyecto académico — React / TypeScript</p>
                        {secretFound && (
                            <p className="mt-3 text-center text-sm font-bold text-yellow-500 animate-pulse">
                                🪺 Easter Egg: Gracias por jugar MindMaster
                            </p>
                        )}
                    </div>
                </div>

                {/* Team Section */}
                <div className="flex w-full flex-col gap-4">
                    {/* Student 1 Card */}
                    <div className="flex items-center gap-4 rounded-xl border border-master-border bg-master-surface/50 p-4 shadow-sm transition-colors hover:border-master-primary/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100/20 text-xl text-green-500">
                            <MdPerson />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-master-text">Valeria Zuluaga Alzate</h3>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-master-muted">Rol: Desarrollo / UI</p>
                            <p className="mt-1 text-sm font-medium text-master-muted">valeria.zuluagaa@upb.edu.co</p>
                        </div>
                    </div>

                    {/* Student 2 Card */}
                    <div className="flex items-center gap-4 rounded-xl border border-master-border bg-master-surface/50 p-4 shadow-sm transition-colors hover:border-master-primary/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100/20 text-xl text-purple-500">
                            <MdPerson />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-master-text">Miguel Aristizábal Pabón</h3>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-master-muted">Rol: Backend</p>
                            <p className="mt-1 text-sm font-medium text-master-muted">miguel.aristizabalp@upb.edu.co</p>
                        </div>
                    </div>

                    {/* Institution Card */}
                    <div className="flex items-center gap-4 rounded-xl border border-master-border bg-master-surface/50 p-4 shadow-sm transition-colors hover:border-master-primary/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100/20 text-xl text-amber-500">
                            <MdSchool />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-master-text">Institución</h3>
                            <p className="text-sm font-medium text-master-text">Universidad Pontificia Bolivariana</p>
                            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-master-muted">AÑO 2026</p>
                        </div>
                    </div>
                </div>

                {/* Additional Info (Bento Style) */}
                <div className="grid w-full grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl border border-master-border/50 bg-master-surface/30 p-4">
                        <MdCode className="text-2xl text-blue-500" />
                        <p className="text-[11px] font-bold uppercase tracking-wider text-master-muted">Tecnología</p>
                        <p className="text-sm font-bold text-master-text">React & Tailwind</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl border border-master-border/50 bg-master-surface/30 p-4">
                        <MdStorage className="text-2xl text-orange-500" />
                        <p className="text-[11px] font-bold uppercase tracking-wider text-master-muted">Database</p>
                        <p className="text-sm font-bold text-master-text">Cloud Firestore</p>
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 w-full pt-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-master-primary py-4 text-lg font-bold text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] transition-all active:translate-y-1 active:shadow-none"
                    >
                        <MdArrowBack className="text-xl" />
                        Volver al Menú
                    </button>
                </div>
            </div>
        </MobileLayout>
    )
}
