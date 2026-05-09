import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'

export function SocialScreen() {
    return (
        <MobileLayout title="Social" subtitle="Espacio preparado para interacción futura">
            <ScreenCard
                title="Próximamente"
                description="Esta pestaña queda reservada para funciones sociales, retos o compartir progreso."
            />
        </MobileLayout>
    )
}
