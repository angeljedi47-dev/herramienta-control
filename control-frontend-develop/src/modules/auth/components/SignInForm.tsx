import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { TextField } from '@/components/inputs/TextField';
import { LOCALSTORAGE_KEYS } from '@/const/localstorage.const';
import useSignIn from '../hooks/useSignIn';
import { useLoginStore } from '../store';

const SignInForm = () => {
    const navigate = useNavigate();
    const { setAuthenticated } = useLoginStore();
    const { setPermisos } = useLoginStore();
    const { setUserData } = useLoginStore();
    const { form, handleSubmit, isPending } = useSignIn({
        onSuccess: (data) => {
            setAuthenticated(true);
            setPermisos(data.permisos);
            setUserData(data.userData);
            localStorage.setItem(LOCALSTORAGE_KEYS.TOKEN_AUTH, data.token);
            navigate({
                to: '/admin',
                from: '/auth/login',
            });
        },
    });

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <TextField
                        form={form}
                        name="nombreUsuario"
                        label="Nombre de usuario"
                        inputOptions={{
                            placeholder: 'Nombre de usuario',
                        }}
                    />

                    <TextField
                        form={form}
                        name="password"
                        label="Contraseña"
                        inputOptions={{
                            placeholder: 'Contraseña',
                            type: 'password',
                        }}
                    />

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full mt-4"
                    >
                        Iniciar sesión
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default SignInForm;
