import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTipoInforme } from '../apis/tiposInforme.api';

export const useDeleteTipoInforme = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTipoInforme,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['GET_TIPOS_INFORME'] });
        },
    });
};
