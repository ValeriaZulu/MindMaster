import { Link } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'

export function CreditsScreen() {
    return (
        <MobileLayout title="Créditos" subtitle="Base académica del proyecto">
            <div className="space-y-4">
                <ScreenCard title="MindMaster" description="Proyecto académico construido con React + TypeScript.">
                    <div className="space-y-2 text-sm text-master-muted">
                        <p>Referencia visual: wireframes y logo oficial.</p>
                    </div>
                </ScreenCard>
                <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/home">
                    Volver al menú
                </Link>
            </div>
        </MobileLayout>
    )
}
