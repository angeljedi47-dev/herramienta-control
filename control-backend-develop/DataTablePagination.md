# Guía de Paginación, Ordenamiento y Filtrado

## Índice

- [ Guía de Paginación, Ordenamiento y Filtrado](#guía-de-paginación-ordenamiento-y-filtrado)
- [Indice](#Índice)
- [Características](#características)
- [Cómo Implementar Paginación en un Nuevo Módulo](#Cómo-Implementar-Paginación-en-un-Nuevo-Módulo)
- [1. Definir la Configuración de Paginación](#Definir-la-Configuración-de-Paginación)
- [2. Actualiza el controlador](#Actualiza-el-controlador)
- [3. Actualizar el Servicio](#Actualizar-el-Servicio)


Este documento describe la implementación del sistema de paginación en el backend, construido sobre la librería `nestjs-paginate`. Proporciona una forma estandarizada y potente de exponer colecciones de datos que pueden ser consultadas de manera flexible desde el frontend.

## Características

- **Paginación Eficiente**: Manejo de `page` y `limit` para una carga de datos controlada.
- **Ordenamiento Múltiple**: Permite ordenar los resultados por una o más columnas en dirección ascendente (`ASC`) o descendente (`DESC`).
- **Filtrado Avanzado**: Soporta múltiples operadores de filtrado por columna (`ILIKE`, `EQ`, `IN`, `GTE`, `LTE`, `BTW`).
- **Configuración Centralizada**: Cada entidad paginada tiene un objeto de configuración (`PaginateConfig`) que define las reglas de consulta permitidas.
- **Documentación Automática en Swagger**: Los endpoints se documentan automáticamente, mostrando todos los parámetros de paginación, ordenamiento y filtrado disponibles.

## Cómo Implementar Paginación en un Nuevo Módulo

Para habilitar la paginación en una nueva entidad (por ejemplo, `productos`), sigue estos tres pasos.

### Definir la Configuración de Paginación

`(...const.ts)`
En el directorio `const` de tu módulo, crea un archivo para definir la configuración de paginación. Este objeto es la "fuente de la verdad" que dicta qué columnas se pueden ordenar y filtrar.

**[Ejemplo:](./src/modules/users/const/users.const.ts)**

```typescript
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { UsuariosSistemaEntity } from 'src/modules/users/entities/usuarios-sistema.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<UsuariosSistemaEntity> = {
    // Columnas de la entidad por las que se permite ordenar.
    sortableColumns: [
        'id_usuario_sistema',
        'nombre_usuario',
        'fecha_creacion',
        'activo',
    ],
    // Ordenamiento por defecto si el frontend no especifica uno.
    defaultSortBy: [['id_usuario_sistema', 'ASC']],
    // Columnas por las que se puede filtrar y los operadores permitidos para cada una.
    filterableColumns: {
        nombre_usuario: [FilterOperator.EQ, FilterOperator.ILIKE],
        activo: [FilterOperator.EQ],
        id_usuario_sistema: [FilterOperator.IN],
        fecha_creacion: [
            FilterOperator.GTE, // Mayor o igual que
            FilterOperator.LTE, // Menor o igual que
            FilterOperator.BTW, // Entre dos fechas
        ],
    },
};
```

### Actualiza el controlador 

(`...controller.ts`)
En el controlador, utiliza los decoradores @Paginate() y @ApiPaginationQuery() en el método findAll.

```typescript
...
@Paginate()// <--  Inyecta el objeto PaginateQuery ya procesado en el método.
@ApiPaginationQuery()// <-- Lee tu PAGINATION_CONFIG y genera automáticamente la documentación de los parámetros en Swagger.
```
**[Ejemplo:](./src/modules/users/controllers/usuarios.controller.ts)**


```typescript
...
@ApiOperation({ summary: 'Obtener todos los usuarios paginados' })
    @Get()
    @ApiPaginationQuery(USER_PAGINATION_CONFIG) // <-- Documenta en Swagger
    async findAll(@Paginate() query: PaginateQuery) { // <-- Inyecta la query
        const data = await this.usuariosService.findAll(query);
        return CustomResponse.buildResponse({
            message: 'Usuarios obtenidos correctamente',
            data,
        });
    }
    
```
## Actualizar el Servicio

 - El servicio recibe el PaginateQuery y lo pasa a la función paginate junto con un QueryBuilder de TypeORM y la configuración que definiste.

 - Puede enviarse directamente el Repository<TEntity> de la entidad que se necesita páginar.

 - Se pueden agregar condiciones `where`en PAGINATION_CONFIG


**[Ejemplo:](./src/modules/users/services/usuarios.service.ts)**

```typescript
...

  async findAll(query: PaginateQuery): Promise<Paginated<IUserPaginatedMapped>> {
        // 1. Construye tu consulta base, incluyendo los JOINs necesarios.
        const queryBuilder = this.usuariosRepository
            .createQueryBuilder('usuarios_sistema')
            .leftJoinAndSelect('usuarios_sistema.roles_asignados', 'roles_asignados')
            .leftJoinAndSelect('roles_asignados.rol', 'rol');

        // 2. Llama a la función paginate.
        const paginatedResult = await paginate<UsuariosSistemaEntity>(
            query,
            queryBuilder,
            USER_PAGINATION_CONFIG, // <-- Usa la configuración centralizada
        );

        // 3. Mapea los resultados si es necesario.
        return {
            ...paginatedResult,
            data: paginatedResult.data.map(UsuariosMapper.toUserPaginatedMapped),
        };
    }
```
**Ejemplo con condición 'where' personalizada:** 

```typescript
...

  constructor(
        private solicitudesRepository: Repository<SolicitudesPrestamoEntity>,
        ...)
...

  async findAllBySolicitante(
        query: PaginateQuery,
        idSolicitante: number,
    ): Promise<Paginated<ISolicitudSolicitantePaginatedMapped>> {
    
    // 1. Agrega una condición personalizada para la paginación.
        SOLICITUD_SOLICITANTE_PAGINATION_CONFIG.where = {
            ...SOLICITUD_SOLICITANTE_PAGINATION_CONFIG.where,
            id_solicitante: idSolicitante,
        };

   // 2. Agrega directamente la entidad y sus relaciones configuradas directamente mediante un Repository<TEntidad>
        const result = await paginate<SolicitudesPrestamoEntity>(
            query,
            this.solicitudesRepository,
            SOLICITUD_SOLICITANTE_PAGINATION_CONFIG,
        );
    
    // 3. Mapea los resultados si es necesario.
        return {
            data: result.data.map(
                SolicitudesMapper.toSolicitudSolicitantePaginated,
            ),
            meta: result.meta as Paginated<ISolicitudSolicitantePaginatedMapped>['meta'],
            links: result.links,
        };
    }

```









    
   






























