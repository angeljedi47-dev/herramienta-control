import { DataTable } from '@/components/tables';
import { IAction } from '@/components/actions/ActionMenu';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, RotateCcw, Trash2 } from 'lucide-react';
import { IUserPaginatedMapped } from '../interfaces';
import { getUsersPaginated } from '../apis';

interface ITableUserProps {
    returnToEditUser?: (user: IUserPaginatedMapped) => void;
    returnDeleteUser?: (user: IUserPaginatedMapped) => void;
    returnRestoreUser?: (user: IUserPaginatedMapped) => void;
}

export const TableUser = ({
    returnToEditUser,
    returnDeleteUser: onDeleteUser,
    returnRestoreUser: onRestoreUser,
}: ITableUserProps) => {
    const usersColumns: ColumnDef<IUserPaginatedMapped>[] = [
        {
            accessorKey: 'nombreUsuario',
            id: 'nombre_usuario',
            header: 'Nombre',
            enableSorting: true,
        },
        {
            accessorKey: 'activo',
            id: 'activo',
            header: 'Activo',
            enableSorting: true,
        },
        {
            accessorKey: 'fechaCreacion',
            id: 'fecha_creacion',
            header: 'Fecha de creación',
            accessorFn: (row) => row.fechaCreacion.toLocaleString(),
            enableSorting: true,
        },
        {
            accessorKey: 'fechaModificacion',
            id: 'fecha_modificacion',
            header: 'Fecha de modificación',
            accessorFn: (row) => row.fechaModificacion.toLocaleString(),
            enableSorting: true,
        },
    ];

    const tableActions: IAction<IUserPaginatedMapped>[] = [
        {
            label: 'Editar',
            icon: <Edit2 className="h-4 w-4" />,
            onClick: (user) => user && returnToEditUser?.(user),
            disabled: !returnToEditUser,
        },
        {
            label: 'Eliminar',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (user) => user && onDeleteUser?.(user),
            disabled: !onDeleteUser,
        },
        {
            label: 'Restaurar',
            icon: <RotateCcw className="h-4 w-4" />,
            onClick: (user) => user && onRestoreUser?.(user),
            disabled: !onRestoreUser,
        },
    ];

    return (
        <DataTable
            columns={usersColumns}
            actions={tableActions}
            queryKey={['PAGINATION_USERS']}
            queryFn={getUsersPaginated}
            initialPagination={{ page: 1, limit: 10 }}
            filterFields={[
                {
                    name: 'id_usuario_sistema',
                    label: 'Por id de usuario (Separa por comas)',
                    type: 'text',
                    operators: ['$in'],
                },
                {
                    name: 'nombre_usuario',
                    label: 'Nombre',
                    type: 'text',
                    operators: ['$eq', '$ilike'],
                },
                {
                    type: 'date',
                    name: 'fecha_creacion',
                    label: 'Fecha de creación',
                    operators: ['$eq', '$gte', '$lte', '$btw'],
                },
                {
                    type: 'date',
                    name: 'fecha_modificacion',
                    label: 'Fecha de modificación',
                    operators: ['$eq', '$gte', '$lte', '$btw'],
                },
            ]}
            filterOnChange={false}
        />
    );
};
