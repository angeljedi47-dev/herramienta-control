import { useLoginStore } from '@/modules/auth/store';

type PermissionType = 'operaciones' | 'modulos';

interface IUseCanParams {
    operation: number | number[];
    tipo?: PermissionType;
    all?: boolean;
}

/**
 * Hook que valida si el usuario tiene los permisos necesarios.
 * @param operation - Permiso(s) a validar (número o array de números)
 * @param tipo - Tipo de permiso: 'operaciones' (default) o 'modulos'
 * @param all - Si true, valida que TODOS los permisos estén presentes. Si false, valida que AL MENOS UNO esté presente
 * @returns boolean - true si el usuario tiene el/los permiso(s), false en caso contrario
 */
export const useCan = ({
    operation,
    tipo = 'operaciones',
    all = false,
}: IUseCanParams): boolean => {
    const { permisos } = useLoginStore();
    const userPermissions = permisos[tipo];

    const operations = Array.isArray(operation) ? operation : [operation];

    if (all) {
        return operations.every((op) => userPermissions.includes(op));
    }

    return operations.some((op) => userPermissions.includes(op));
};
