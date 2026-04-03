import { IAction } from '@/components/actions/ActionMenu';
import { DataTable } from '@/components/tables';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import { IRolesPaginatedMapped } from '../interfaces';
import { getRolesPaginate } from '../apis';

interface ITableRoles {
    returnToEditRole?: (role: IRolesPaginatedMapped) => void;
    returnDeleteRole?: (role: IRolesPaginatedMapped) => void;
}

const TableRoles = ({ returnToEditRole, returnDeleteRole }: ITableRoles) => {
    const columnsRoles: ColumnDef<IRolesPaginatedMapped>[] = [
        {
            accessorKey: 'nombreRole',
            id: 'nombre_rol',
            header: 'Nombre',
        },
        {
            accessorKey: 'fechaCreacion',
            id: 'fecha_creacion',
            header: 'Fecha de creación',
            accessorFn: (row) => row.fechaCreacion.toLocaleString(),
        },
        {
            accessorKey: 'fechaModificacion',
            id: 'fecha_modificacion',
            header: 'Fecha de modificación',
            accessorFn: (row) => row.fechaModificacion.toLocaleString(),
        },
    ];

    const actions: IAction<IRolesPaginatedMapped>[] = [
        {
            label: 'Editar',
            icon: <Edit2 className="h-4 w-4" />,
            onClick: (role) => role && returnToEditRole?.(role),
            disabled: !returnToEditRole,
        },
        {
            label: 'Eliminar',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (role) => role && returnDeleteRole?.(role),
            disabled: !returnDeleteRole,
        },
    ];

    return (
        <DataTable
            columns={columnsRoles}
            actions={actions}
            queryFn={getRolesPaginate}
            queryKey={['GET_ROLES']}
            initialPagination={{ page: 1, limit: 10 }}
            filterFields={[
                {
                    label: 'Por id del rol',
                    name: 'id_rol',
                    type: 'text',
                    operators: ['$in'],
                },
                {
                    label: 'Por nombre del rol',
                    name: 'nombre_rol',
                    type: 'text',
                    operators: ['$ilike', '$in'],
                },
                {
                    label: 'Por fecha de creación',
                    name: 'fecha_creacion',
                    type: 'date',
                    operators: ['$gte', '$lte', '$btw', '$eq'],
                },
                {
                    label: 'Por fecha de modificación',
                    name: 'fecha_modificacion',
                    type: 'date',
                    operators: ['$gte', '$lte', '$btw', '$eq'],
                },
            ]}
            filterOnChange={false}
        />
    );
};

export default TableRoles;
