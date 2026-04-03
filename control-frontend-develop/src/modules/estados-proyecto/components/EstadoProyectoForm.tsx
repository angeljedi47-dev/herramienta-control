import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogClose } from '@radix-ui/react-dialog';
import { useCreateEstadoProyecto } from '../hooks/useCreateEstadoProyecto';
import { IEstadoProyecto } from '../interfaces/estadosProyecto.interface';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
    onSuccess: () => void;
    estadoToEdit?: IEstadoProyecto;
}

const EstadoProyectoForm = ({ onSuccess, estadoToEdit }: Props) => {
    const { handleSubmit, isPending, form } = useCreateEstadoProyecto({ onSuccess, estadoToEdit });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <TextField
                    form={form}
                    name="nombre"
                    label="Nombre del estado"
                    inputOptions={{ placeholder: 'Ej. Desarrollo' }}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="color_hex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color Representativo</FormLabel>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        className="h-10 w-14 rounded cursor-pointer border-0 p-1 bg-white" 
                                        {...field}
                                    />
                                    <span className="text-sm text-gray-500 uppercase font-mono">{field.value}</span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="es_final"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-slate-50">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-semibold">
                                        Estado Final
                                    </FormLabel>
                                    <p className="text-xs text-muted-foreground mr-2">
                                        Agrupará proyectos al final en vistas públicas.
                                    </p>
                                </div>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-wrap justify-end gap-2 pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="neutral" disabled={isPending}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {estadoToEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EstadoProyectoForm;
