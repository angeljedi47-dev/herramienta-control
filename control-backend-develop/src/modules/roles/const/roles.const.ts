import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { RolesEntity } from 'src/modules/roles/entities/roles.entity';

export const ROLE_PAGINATION_CONFIG: PaginateConfig<RolesEntity> = {
    sortableColumns: [
        'id_rol',
        'nombre_rol',
        'fecha_creacion',
        'fecha_modificacion',
    ],
    filterableColumns: {
        id_rol: [FilterOperator.IN],
        nombre_rol: [FilterOperator.IN, FilterOperator.ILIKE],
        fecha_creacion: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
            FilterOperator.BTW,
        ],
        fecha_modificacion: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
            FilterOperator.BTW,
        ],
    },
    defaultSortBy: [['fecha_modificacion', 'DESC']],
};
