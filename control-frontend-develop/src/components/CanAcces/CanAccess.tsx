import { ReactNode } from 'react';
import { useCan } from '@/hooks/auth/useCan';

type PermissionType = 'operaciones' | 'modulos';

interface ICanAccessProps {
    operation: number | number[];
    tipo?: PermissionType;
    all?: boolean;
    children: ReactNode;
}

/**
 * Componente Guard que renderiza su contenido solo si el usuario tiene los permisos requeridos.
 * Si no tiene permisos, no renderiza nada.
 *
 * @example
 * <CanAccess operation={OPERACIONES_ACCESO.AGREGAR_USUARIO}>
 *   <Button>Crear Usuario</Button>
 * </CanAccess>
 *
 * @example
 * <CanAccess operation={[OPERACIONES_ACCESO.EDITAR_USUARIO, OPERACIONES_ACCESO.ELIMINAR_USUARIO]} all>
 *   <Button>Acciones</Button>
 * </CanAccess>
 */
export const CanAccess = ({
    operation,
    tipo = 'operaciones',
    all = false,
    children,
}: ICanAccessProps) => {
    const hasPermission = useCan({ operation, tipo, all });

    if (!hasPermission) {
        return null;
    }

    return <>{children}</>;
};
