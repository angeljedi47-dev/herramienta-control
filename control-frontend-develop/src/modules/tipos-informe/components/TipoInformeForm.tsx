import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DialogClose } from '@radix-ui/react-dialog';
import { useCreateTipoInforme } from '../hooks/useCreateTipoInforme';
import { ITipoInforme } from '../interfaces/tiposInforme.interface';

interface Props {
    onSuccess: () => void;
    tipoToEdit?: ITipoInforme;
}

const TipoInformeForm = ({ onSuccess, tipoToEdit }: Props) => {
    const { handleSubmit, isPending, form } = useCreateTipoInforme({ onSuccess, tipoToEdit });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <TextField
                    form={form}
                    name="nombre"
                    label="Nombre del tipo de informe"
                    inputOptions={{ placeholder: 'Ej. Reporte Mensual' }}
                />

                <TextField
                    form={form}
                    name="slug"
                    label="Slug (URL Amigable)"
                    inputOptions={{ placeholder: 'ej-reporte-mensual' }}
                />

                <div className="flex flex-wrap justify-end gap-2 pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="neutral" disabled={isPending}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {tipoToEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TipoInformeForm;
