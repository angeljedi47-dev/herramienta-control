import { TextField } from '@/components/inputs/TextField';
import { DatePicker } from '@/components/inputs/DatePicker';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogClose } from '@radix-ui/react-dialog';
import { useCreateProject } from '../hooks';
import { IProjectMapped } from '../interfaces';
import { useQuery } from '@tanstack/react-query';
import { getTiposInforme } from '@/modules/tipos-informe/apis/tiposInforme.api';

interface IProjectFormProps {
    onSuccess: () => void;
    projectToEdit?: IProjectMapped;
}

const ProjectForm = ({ onSuccess, projectToEdit }: IProjectFormProps) => {
    const { handleSubmit, isPending, form } = useCreateProject({
        onSuccess,
        projectToEdit,
    });

    const { data: tiposInforme, isLoading: isTiposLoading } = useQuery({
        queryKey: ['GET_TIPOS_INFORME'],
        queryFn: getTiposInforme,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <TextField
                    form={form}
                    name="nombre"
                    label="Nombre del proyecto"
                    inputOptions={{ placeholder: 'Ingrese el nombre' }}
                />

                <TextField
                    form={form}
                    name="descripcion"
                    label="Descripción"
                    inputOptions={{ placeholder: 'Ingrese una descripción (opcional)' }}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Proyecto<span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Nuevo Sistema">Nuevo Sistema</SelectItem>
                                        <SelectItem value="Actualización">Actualización</SelectItem>
                                        <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado<span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Planeación">Planeación</SelectItem>
                                        <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                                        <SelectItem value="Pruebas">Pruebas</SelectItem>
                                        <SelectItem value="Liberado">Liberado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                        form={form}
                        name="fecha_inicio"
                        label="Fecha de Inicio"
                    />
                    <DatePicker
                        form={form}
                        name="fecha_fin_estimada"
                        label="Fecha de Fin Estimada"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <TextField
                        form={form}
                        name="porcentaje"
                        label="Porcentaje de avance (%)"
                        inputOptions={{ placeholder: 'Ej. 50', type: 'number', min: 0, max: 100 }}
                    />
                    
                    <FormField
                        control={form.control}
                        name="id_tipo_informe"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Informe (Catálogo)</FormLabel>
                                <Select 
                                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)} 
                                    defaultValue={field.value?.toString() || ''}
                                    disabled={isTiposLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el tipo de informe" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {tiposInforme?.map((tipo) => (
                                            <SelectItem key={tipo.id_tipo_informe} value={tipo.id_tipo_informe.toString()}>
                                                {tipo.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
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
                        {projectToEdit ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProjectForm;
