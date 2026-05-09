import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'

export function SplashScreen() {
    return (
        <MobileLayout showNavigation={false} title="MindMaster" subtitle="Libera tu potencial mental">
            <div className="flex min-h-full flex-col justify-between gap-6 py-2">
                <ScreenCard
                    title="Bienvenido"
                    description="Esta versión inicial deja lista la navegación, la autenticación anónima y el flujo base para avanzar por fases."
                >
                    <div className="flex justify-center">
                        <div className="flex h-40 w-40 items-center justify-center rounded-full border border-master-border bg-master-surface shadow-lg">
                            <span className="text-4xl text-master-primary">⚡</span>
                        </div>
                    </div>
                </ScreenCard>

                <Link className="rounded-full bg-master-primary px-5 py-4 text-center text-base font-semibold text-white shadow-lg" to="/home">
                    Comenzar
                </Link>
            </div>
        </MobileLayout>
    )
}
