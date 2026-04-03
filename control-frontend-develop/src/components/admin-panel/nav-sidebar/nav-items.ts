import { House, UserCog, Users, Briefcase, ShieldAlert } from 'lucide-react';
import { MODULOS_ACCESO } from '@/const/variables_acceso';
import { INavSidebarItem } from './types';

export const navOptions: INavSidebarItem[] = [
    {
        id: 1,
        name: 'Inicio',
        url: '/admin',
        icon: House,
    },
    {
        id: 2,
        id_db: [MODULOS_ACCESO.USUARIOS],
        name: 'Usuarios',
        url: '/admin/users',
        icon: Users,
    },
    {
        id: 3,
        id_db: [MODULOS_ACCESO.ROLES],
        name: 'Roles',
        url: '/admin/roles',
        icon: UserCog,
    },
    {
        id: 4,
        name: 'Proyectos',
        url: '/admin/projects',
        icon: Briefcase,
    },
    {
        id: 5,
        name: 'Estados de Proyecto',
        url: '/admin/estados-proyecto',
        icon: ShieldAlert,
    },
    {
        id: 6,
        name: 'Tipos de Informe',
        url: '/admin/tipos-informe',
        icon: ShieldAlert,
    },
];
