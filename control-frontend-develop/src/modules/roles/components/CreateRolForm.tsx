import { TextField } from '@/components/inputs/TextField';
import { CheckboxGroup } from '@/components/inputs/CheckboxGroup';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DialogClose } from '@radix-ui/react-dialog';
import useCreateRol from '../hooks/useCreateRol';
import { IRolesPaginatedMapped } from '../interfaces';
import useModuloWithOperations from '../hooks/useModuloWithOperations';

interface ICreateRolFormProps {
    onSuccess: () => void;
    rolToEdit?: IRolesPaginatedMapped;
}

const CreateRolForm = ({ onSuccess, rolToEdit }: ICreateRolFormProps) => {
    const {
        data: modulosWithOperations,
        isLoading,
        error,
    } = useModuloWithOperations();

    const { handleSubmit, isPending, form } = useCreateRol({
        onSuccess,
        rolToEdit,
    });

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                >
                    <TextField
                        form={form}
                        name="nombreRol"
                        label="Nombre del rol"
                        inputOptions={{
                            placeholder: 'Nombre del rol',
                        }}
                    />

                    {modulosWithOperations?.data.map((modulo) => (
                        <div key={modulo.nombreModulo} className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                {modulo.nombreModulo}
                            </h3>

                            <CheckboxGroup
                                form={form}
                                name="operaciones"
                                options={modulo.operaciones}
                                propertiesMapped={{
                                    value: 'idOperacion',
                                    label: 'nombreOperacion',
                                }}
                            />
                        </div>
                    ))}

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
                            {rolToEdit ? 'Actualizar rol' : 'Crear rol'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default CreateRolForm;
