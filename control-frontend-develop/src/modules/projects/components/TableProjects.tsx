import { IAction } from '@/components/actions/ActionMenu';
import { DataTable } from '@/components/tables';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import { IProjectMapped } from '../interfaces';
import { getProjectsPaginate } from '../apis';
import dayjs from 'dayjs';

interface ITableProjects {
    returnToEditProject?: (project: IProjectMapped) => void;
    returnDeleteProject?: (project: IProjectMapped) => void;
}

const TableProjects = ({ returnToEditProject, returnDeleteProject }: ITableProjects) => {
    const columnsProjects: ColumnDef<IProjectMapped>[] = [
        {
            accessorKey: 'nombre',
            id: 'nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'tipo',
            id: 'tipo',
            header: 'Tipo',
        },
        {
            accessorKey: 'estado',
            id: 'estado',
            header: 'Estado',
        },
        {
            accessorKey: 'fechaInicio',
            id: 'fecha_inicio',
            header: 'Fecha de Inicio',
            accessorFn: (row) => row.fechaInicio ? dayjs(row.fechaInicio).format('DD/MM/YYYY') : 'N/A',
        },
        {
            accessorKey: 'fechaFinEstimada',
            id: 'fecha_fin_estimada',
            header: 'Fin Estimado',
            accessorFn: (row) => row.fechaFinEstimada ? dayjs(row.fechaFinEstimada).format('DD/MM/YYYY') : 'N/A',
        },
    ];

    const actions: IAction<IProjectMapped>[] = [
        {
            label: 'Editar',
            icon: <Edit2 className="h-4 w-4" />,
            onClick: (project) => project && returnToEditProject?.(project),
            disabled: !returnToEditProject,
        },
        {
            label: 'Eliminar',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (project) => project && returnDeleteProject?.(project),
            disabled: !returnDeleteProject,
        },
    ];

    return (
        <DataTable
            columns={columnsProjects}
            actions={actions}
            queryFn={getProjectsPaginate}
            queryKey={['GET_PROJECTS']}
            initialPagination={{ page: 1, limit: 10 }}
            filterFields={[
                {
                    label: 'Por nombre',
                    name: 'nombre',
                    type: 'text',
                    operators: ['$ilike', '$in'],
                },
                {
                    label: 'Por estado',
                    name: 'estado',
                    type: 'select',
                    options: [
                        { value: 'Planeación', label: 'Planeación' },
                        { value: 'Desarrollo', label: 'Desarrollo' },
                        { value: 'Pruebas', label: 'Pruebas' },
                        { value: 'Liberado', label: 'Liberado' },
                    ],
                    operators: ['$eq', '$in'],
                },
                {
                    label: 'Por tipo',
                    name: 'tipo',
                    type: 'select',
                    options: [
                        { value: 'Nuevo Sistema', label: 'Nuevo Sistema' },
                        { value: 'Actualización', label: 'Actualización' },
                        { value: 'Mantenimiento', label: 'Mantenimiento' },
                    ],
                    operators: ['$eq', '$in'],
                },
            ]}
            filterOnChange={false}
        />
    );
};

export default TableProjects;
