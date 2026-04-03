import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { UsuariosSistemaEntity } from 'src/modules/users/entities/usuarios-sistema.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<UsuariosSistemaEntity> = {
    sortableColumns: [
        'id_usuario_sistema',
        'nombre_usuario',
        'fecha_creacion',
        'fecha_modificacion',
        'activo',
    ],
    defaultSortBy: [['id_usuario_sistema', 'ASC']],
    filterableColumns: {
        id_usuario_sistema: [FilterOperator.IN],
        nombre_usuario: [FilterOperator.EQ, FilterOperator.ILIKE],
        fecha_creacion: [
            FilterOperator.GTE,
            FilterOperator.LTE,
            FilterOperator.BTW,
            FilterOperator.EQ,
        ],
        fecha_modificacion: [
            FilterOperator.GTE,
            FilterOperator.LTE,
            FilterOperator.BTW,
            FilterOperator.EQ,
        ],
    },
};
