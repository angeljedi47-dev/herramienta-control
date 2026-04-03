import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { ProyectosEntity } from '../entities/proyectos.entity';

export const PROYECTOS_PAGINATION_CONFIG: PaginateConfig<ProyectosEntity> = {
    sortableColumns: ['id_proyecto', 'nombre', 'tipo', 'fecha_modificacion', 'tipoInforme.nombre', 'estadoProyecto.nombre'],
    nullSort: 'last',
    defaultSortBy: [['fecha_modificacion', 'DESC']],
    searchableColumns: ['nombre', 'descripcion', 'tipo', 'tipoInforme.nombre', 'estadoProyecto.nombre'],
    maxLimit: 100,
    defaultLimit: 10,
    relations: ['tipoInforme', 'estadoProyecto'],
    filterableColumns: {
        tipo: [FilterOperator.EQ, FilterOperator.IN],
        activo: [FilterOperator.EQ],
    },
};
