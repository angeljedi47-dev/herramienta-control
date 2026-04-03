import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEstadoProyecto } from '../apis/estadosProyecto.api';

export const useDeleteEstadoProyecto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEstadoProyecto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['GET_ESTADOS_PROYECTO'] });
        },
    });
};
