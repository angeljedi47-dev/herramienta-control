import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DialogClose } from '@/components/ui/dialog';
import { TextField } from '@/components/inputs/TextField';
import { Combobox } from '@/components/inputs/Combobox';
import { getRolesByTerm } from '@/modules/roles/apis';
import { ICreateUserSchema } from '../schemas';
import useCreateUser from '../hooks/useCreateUser';

interface ICreateUsersFormProps {
    onSuccess: () => void;
    userToEdit?: ICreateUserSchema;
}

export const CreateUsersForm = ({
    onSuccess,
    userToEdit,
}: ICreateUsersFormProps) => {
    const { form, handleSubmit, isPending } = useCreateUser({
        userToEdit,
        cbSuccess: onSuccess,
    });

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                >
                    <TextField
                        form={form}
                        name="nombreUsuario"
                        label="Nombre de usuario"
                        inputOptions={{
                            placeholder: 'joe.macias',
                        }}
                        showCharCounter
                        isRequired
                    />
                    <TextField
                        form={form}
                        name="password"
                        label="Contraseña"
                        inputOptions={{
                            minLength: 8,
                            type: 'password',
                        }}
                        description="La contraseña debe tener al menos 8 caracteres."
                    />

                    <TextField
                        form={form}
                        name="confirmPassword"
                        label="Confirmar contraseña"
                        inputOptions={{
                            type: 'password',
                        }}
                    />

                    <Combobox
                        form={form}
                        name="roles"
                        label="Roles"
                        isMulti
                        searchFn={getRolesByTerm}
                        queryKey={['COMBOBOX_SEARCH_ROLES']}
                        propertiesMapped={{
                            label: 'nombreRole',
                            value: 'idRole',
                        }}
                    />

                    <div className="flex flex-wrap justify-end gap-2">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="neutral"
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isPending}>
                            {userToEdit ? 'Editar usuario' : 'Crear usuario'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};
