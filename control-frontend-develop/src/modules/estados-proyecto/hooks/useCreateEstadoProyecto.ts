import { useQueryClient } from '@tanstack/react-query';
import { useMutationForm } from '@/hooks';
import { ICreateEstadoProyecto, IEstadoProyecto } from '../interfaces/estadosProyecto.interface';
import { estadoProyectoSchema } from '../schemas/estadosProyecto.schema';
import { createEstadoProyecto, updateEstadoProyecto } from '../apis/estadosProyecto.api';

export const useCreateEstadoProyecto = ({ onSuccess, estadoToEdit }: { onSuccess: () => void, estadoToEdit?: IEstadoProyecto }) => {
    const queryClient = useQueryClient();

    const { form, handleSubmit, isPending } = useMutationForm({
        schema: estadoProyectoSchema,
        defaultValues: {
            id_estado_proyecto: estadoToEdit?.id_estado_proyecto,
            nombre: estadoToEdit?.nombre || '',
            color_hex: estadoToEdit?.color_hex || '#64748b',
            es_final: estadoToEdit?.es_final || false,
        },
        errorMapping: {
            id_estado_proyecto: 'id_estado_proyecto',
            nombre: 'nombre',
            color_hex: 'color_hex',
            es_final: 'es_final',
        },
        mutationKey: ['CREATE_ESTADO_PROYECTO'] as any,
        mutationFn: (data: ICreateEstadoProyecto) => {
            if (estadoToEdit) {
                return updateEstadoProyecto({ ...data, id_estado_proyecto: estadoToEdit.id_estado_proyecto });
            }
            return createEstadoProyecto(data);
        },
        cbSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['GET_ESTADOS_PROYECTO'] });
            onSuccess();
        },
    });

    return { form, handleSubmit, isPending };
};
