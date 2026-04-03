import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { ProyectosEntity } from '../entities/proyectos.entity';

export const PROYECTOS_PAGINATION_CONFIG: PaginateConfig<ProyectosEntity> = {
    sortableColumns: ['id_proyecto', 'nombre', 'estado', 'tipo', 'fecha_modificacion', 'tipoInforme.nombre'],
    nullSort: 'last',
    defaultSortBy: [['fecha_modificacion', 'DESC']],
    searchableColumns: ['nombre', 'descripcion', 'estado', 'tipo', 'tipoInforme.nombre'],
    maxLimit: 100,
    defaultLimit: 10,
    relations: ['tipoInforme'],
    filterableColumns: {
        estado: [FilterOperator.EQ, FilterOperator.IN],
        tipo: [FilterOperator.EQ, FilterOperator.IN],
        activo: [FilterOperator.EQ],
    },
};
