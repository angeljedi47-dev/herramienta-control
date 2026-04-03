import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import LinkApp from '@/components/buttons/LinkApp';

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="border-0">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-secondary-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-bold text-card-foreground">
                            Restablecer contraseña
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Ingresa tu email y te enviaremos las instrucciones
                            para crear una nueva contraseña
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Formulario en desarrollo ya que dependera el proyecto */}
                        <p>En desarrollo</p>
                        <div className="mt-6 text-center">
                            <LinkApp to="/auth/login" size="sm">
                                ← Volver al login
                            </LinkApp>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
