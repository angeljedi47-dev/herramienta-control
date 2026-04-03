import { IDataUserLoggedMapped, IPermisos } from '@/modules/auth/interfaces';
import { QueryClient } from '@tanstack/react-query';

export interface IRouteContext {
    authenticated: boolean | undefined;
    setAuthenticated: (authenticated: boolean) => void;
    setPermisos: (permisos: IPermisos) => void;
    modulos: number[];
    queryClient: QueryClient | undefined;
    setUserData: (userData: IDataUserLoggedMapped) => void;
}

export const defaultRouteContext: IRouteContext = {
    authenticated: undefined,
    setAuthenticated: () => {},
    setPermisos: () => {},
    modulos: [],
    queryClient: undefined,
    setUserData: () => {},
} as const;
