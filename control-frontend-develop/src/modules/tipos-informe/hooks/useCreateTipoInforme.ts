import { useQueryClient } from '@tanstack/react-query';
import { ICreateTipoInforme, ITipoInforme } from '../interfaces/tiposInforme.interface';
import { createTipoInforme, updateTipoInforme } from '../apis/tiposInforme.api';
import { useMutationForm } from '@/hooks';
import { tipoInformeSchema } from '../schemas/tiposInforme.schema';

export const useCreateTipoInforme = ({ onSuccess, tipoToEdit }: { onSuccess: () => void, tipoToEdit?: ITipoInforme }) => {
    const queryClient = useQueryClient();

    const { form, handleSubmit, isPending } = useMutationForm({
        schema: tipoInformeSchema,
        defaultValues: {
            id_tipo_informe: tipoToEdit?.id_tipo_informe,
            nombre: tipoToEdit?.nombre || '',
            slug: tipoToEdit?.slug || '',
        },
        errorMapping: {
            id_tipo_informe: 'id_tipo_informe',
            nombre: 'nombre',
            slug: 'slug',
        },
        mutationKey: ['CREATE_TIPO_INFORME'],
        mutationFn: (data: ICreateTipoInforme) => {
            if (tipoToEdit) {
                return updateTipoInforme({ ...data, id_tipo_informe: tipoToEdit.id_tipo_informe });
            }
            return createTipoInforme(data);
        },
        cbSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['GET_TIPOS_INFORME'] });
            onSuccess();
        },
    });

    return { form, handleSubmit, isPending };
};
