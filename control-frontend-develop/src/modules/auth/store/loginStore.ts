import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ILoginStore, IPermisos } from '../interfaces';

export const useLoginStore = create(
    devtools<ILoginStore>(
        (set) => ({
            authenticated: false,
            userData: {
                idUsuarioSistema: 0,
                nombreUsuario: '',
            },
            permisos: {
                modulos: [],
                operaciones: [],
            },
            setAuthenticated: (authenticated: boolean) =>
                set({ authenticated }),
            setPermisos: (permisos: IPermisos) => set({ permisos }),
            resetStore: () =>
                set({
                    authenticated: false,
                    permisos: {
                        modulos: [],
                        operaciones: [],
                    },
                }),
            setUserData: (userData) => set({ userData }),
        }),
        {
            name: 'loginStore',
        },
    ),
);
