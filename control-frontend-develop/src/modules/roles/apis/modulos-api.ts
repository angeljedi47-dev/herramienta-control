import { api } from '@/config/axios';
import {
    IReponseModulosWithOperations,
    IReponseModulosWithOperationsDB,
} from '../interfaces';
import { moduloMapper } from '../mappers';

export const getModulosWithOperations =
    async (): Promise<IReponseModulosWithOperations> => {
        const response =
            await api.get<IReponseModulosWithOperationsDB>('/modulos');

        const modulosMapper = response.data.data.map((modulo) =>
            moduloMapper(modulo),
        );

        return {
            data: modulosMapper,
            message: response.data.message,
        };
    };
