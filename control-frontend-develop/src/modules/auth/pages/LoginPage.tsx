import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import SignInForm from '../components/SignInForm';
import logo from '@/assets/images/logoagn.jpg';
import LinkApp from '@/components/buttons/LinkApp';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="border-0">
                    <CardHeader className="text-center space-y-2">
                        <div className="mb-4">
                            <img
                                src={logo}
                                alt="Archivo General de la Nación"
                                className="mx-auto h-14 w-auto object-contain"
                                loading="eager"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-card-foreground">
                            Iniciar sesión
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Ingresa tus credenciales para acceder a tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignInForm />
                        <div className="mt-6 text-center">
                            <LinkApp to="/auth/reset-password" size="sm">
                                ¿Olvidaste tu contraseña?
                            </LinkApp>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
