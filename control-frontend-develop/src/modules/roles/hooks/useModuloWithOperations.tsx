import { useQuery } from '@tanstack/react-query';
import { getModulosWithOperations } from '../apis';

const useModuloWithOperations = () => {
    const query = useQuery({
        queryKey: ['GET_MODULOS_WITH_OPERATIONS'],
        queryFn: getModulosWithOperations,
    });

    return { ...query };
};

export default useModuloWithOperations;
