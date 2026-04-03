# Guía de Uso del Componente DataTable

## Índice

- [Guía de Uso del Componente <DataTable /> (Frontend)](#guía-de-uso-del-componente-datatable)
- [Características Principales](#características-principales)
- [Estructura de Componentes](#estructura-de-componentes)
- [Props del Componente <DataTable />](#props-del-componente-datatable)
- [Ejemplo de Implementación: `TableUser.tsx`](#ejemplo-de-implementación-tableusertsx)
- [Guía de filtros](#guía-de-filtros)
  - [Estructura de un IFilterField](#estructura-de-un-ifilterfield)
  - [Modo de uso en filtros simples](#modo-de-uso-en-filtros-simples)
- [Filtros relacionales](#filtros-relacionales)
- [Ordenamiento](#ordenamiento)
- [Paginación](#paginación)
- [Vista personalizada (cards/list)](#vista-personalizada-cardslist)

Este documento detalla el uso y la configuración del componente reutilizable `<DataTable />`, una solución integral para renderizar tablas de datos con paginación, ordenamiento y filtrado del lado del servidor.

## Características Principales

-   **Componente Centralizado**: Encapsula toda la lógica de la tabla en un solo lugar.
-   **Basado en TanStack**: Utiliza `@tanstack/react-table` para la estructura y lógica de la tabla, y `@tanstack/react-query` para la gestión de datos del servidor (fetching, caching, etc.).
-   **Paginación, Ordenamiento y Filtrado del Servidor**: Toda la lógica pesada se delega al backend, asegurando un rendimiento óptimo con grandes conjuntos de datos.
-   **Altamente Configurable**: Se adapta a diferentes entidades y necesidades a través de props.
-   **Filtros Dinámicos**: Soporta filtros por texto, fecha y listas, con operadores configurables.
-   **Acciones por Fila**: Menú de acciones contextuales (editar, eliminar, etc.) para cada registro.

## Estructura de Componentes

El <DataTable /> es un orquestador que utiliza varios sub-componentes especializados:

## Props del Componente DataTable

Para utilizar el componente, debes proporcionarle las siguientes props:

| Prop | Tipo | Descripción | Requerido |
| :--- | :--- | :--- | :--- |
| `columns` | `ColumnDef<T>[]` | **Definición de las columnas**. Es un array de objetos de `@tanstack/react-table`. El `id` de cada columna es crucial, ya que se usa para el ordenamiento y debe coincidir con un campo en `sortableColumns` del backend. | Sí |
| `actions` | `IAction<T>[]` | **Acciones por fila**. Un array de objetos que definen el menú de acciones (editar, eliminar, etc.) para cada registro. | No |
| `queryKey` | `string[]` | **Clave de la Query**. La clave base para `useQuery`. La paginación, ordenamiento y filtros se añaden automáticamente a esta clave para el cacheo. | Sí |
| `queryFn` | `(params) => Promise<any>` | **Función de Fetching**. La función asíncrona que llama a la API. Recibirá automáticamente el objeto con los parámetros de paginación. | Sí |
| `initialPagination`| `IPaginationQuery` | Estado inicial de la paginación. Por defecto: `{ page: 1, limit: 10 }`. | No |
| `filterFields` | `IFilterField[]` | **Definición de los filtros**. Un array de objetos que describe cada campo de filtro que se mostrará en la UI. | No |
| `filterOnChange` | `boolean` | Si es `true`, la tabla se recarga al cambiar cualquier filtro. Si es `false` (como en `TableUser.tsx`), se muestra un botón "Aplicar Filtros". Por defecto es `true`. | No |
| `viewMode` | `'table' \| 'custom'` | Modo de visualización. `'table'` es el valor por defecto. Usa `'custom'` para renderizar elementos personalizados. | No |
| `renderItem` | `(ctx) => ReactNode` | Función para renderizar cada item en modo `custom`. Recibe `{ item, index, context }`. | No |
| `customLayout` | `{ type?: 'grid' \| 'list'; cols?: number; className?: string }` | Opciones de layout para modo `custom` (grid/list y número de columnas). | No |

## Ejemplo de Implementación: `TableUser.tsx`

El componente `TableUser.tsx` es el ejemplo de cómo implementar <DataTable />.

**[Ejemplo:](../../modules/users/components/TableUser.tsx).**

```typescript

import { DataTable } from '@/components/tables';
import { IAction } from '@/components/actions/ActionMenu';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, RotateCcw, Trash2 } from 'lucide-react';
import { IUserPaginatedMapped } from '../interfaces';
import { getUsersPaginated } from '../apis';

// ... (props de ITableUserProps)

    export const TableUser = ({ /* ...props */ }) => {
        // 1. Definición de Columnas
        const usersColumns: ColumnDef<IUserPaginatedMapped>[] = [
            {
                accessorKey: 'nombreUsuario',
                id: 'nombre_usuario', // <-- ID para ordenamiento (debe coincidir con el backend)
                header: 'Nombre',
                enableSorting: true,
            },
            // ... más columnas
        ];

        // 2. Definición de Acciones
        const tableActions: IAction<IUserPaginatedMapped>[] = [
            {
                label: 'Editar',
                icon: <Edit2 className="h-4 w-4" />,
                onClick: (user) => user && returnToEditUser?.(user),
                disabled: !returnToEditUser,
            },
            // ... más acciones
        ];

        // 3. Implementación del DataTable (tabla por defecto + vista custom debajo)
        return (
            <div className="space-y-8">
                {/* Vista por defecto (tabla) */}
                <DataTable
                    columns={usersColumns}
                    actions={tableActions}
                    queryKey={["PAGINATION_USERS"]}
                    queryFn={getUsersPaginated}
                    initialPagination={{ page: 1, limit: 10 }}
                    filterFields={[
                        // ... ver sección de filtros
                    ]}
                    filterOnChange={false}
                />

                {/* Vista personalizada (cards) usando el mismo endpoint */}
                <DataTable
                    columns={[]}
                    actions={tableActions}
                    queryKey={["PAGINATION_USERS"]}
                    queryFn={getUsersPaginated}
                    initialPagination={{ page: 1, limit: 10 }}
                    filterFields={[]}
                    filterOnChange={false}
                    viewMode="custom"
                    customLayout={{ type: 'grid', cols: 3 }}
                    renderItem={({ item }) => (
                        <div className="rounded-lg border p-4 bg-white shadow-sm">
                            <div className="font-semibold">{item.nombreUsuario}</div>
                            <div className="text-sm text-muted-foreground">
                                Activo: {String(item.activo)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                Creado: {item.fechaCreacion.toLocaleString()}
                                <br />
                                Modificado: {item.fechaModificacion.toLocaleString()}
                            </div>
                        </div>
                    )}
                />
            </div>
        );
    };
```

## Guía de filtros

La prop filterFields es la más compleja y potente. Cada objeto en el array filterFields define un campo del formulario de filtros.

## Estructura de un IFilterField

```typescript
interface IFilterField {
    name: string;       // El nombre del campo (debe coincidir con filterableColumns del backend)
    label: string;      // La etiqueta que se muestra en la UI
    type: 'text' | 'date' | 'select'; // El tipo de input a renderizar
    operators?: string[]; // Operadores permitidos (ej. '$eq', '$ilike', '$btw')
}
```
## Modo de uso en filtros simples

```typescript
{
    name: 'nombre_usuario',
    label: 'Nombre',
    type: 'text',
    operators: ['$eq', '$ilike'], // Permite búsqueda exacta o parcial
}
```

## Filtros relacionales


Una de las características más potentes es la capacidad de filtrar por propiedades de entidades relacionadas. El backend (con nestjs-paginate) ya está preparado para esto.

Se debe usar una cadena de texto con puntos en la propiedad name para representar la ruta de la relación.

Escenario: Filtrar usuarios por el nombre de un rol asignado.


 - Ruta de la relación: roles_asignados.rol.nombre_rol
 - Backend (users.const.ts): Debes asegurarte de que esta ruta esté permitida en filterableColumns

```typescript
filterableColumns: {
    // ... otros filtros
    'roles_asignados.rol.nombre_rol': [FilterOperator.ILIKE],
}
```

Frontend (TableUser.tsx): Simplemente define el name en filterFields con la misma ruta.

```typescript
filterFields={[
    // ... otros filtros
    {
        name: 'roles_asignados.rol.nombre_rol', // <-- Ruta anidada
        label: 'Nombre del Rol',
        type: 'text',
        operators: ['$ilike'],
    },
]}
```
## Ordenamiento

El ordenamiento en el <DataTable /> es completamente automático y no requiere configuración adicional en el frontend, más allá de definir correctamente las columnas en el array usersColumns (o el array de columnas correspondiente a tu entidad). Para habilitar el ordenamiento en una columna, simplemente agrega la propiedad enableSorting: true en la definición de la columna:

```typescript
const usersColumns: ColumnDef<IUserPaginatedMapped>[] = [
    {
        ...
        enableSorting: true,
    },
    // ... más columnas
];
```
El valor de la propiedad id de la columna debe coincidir exactamente con uno de los campos listados en la propiedad sortableColumns de la configuración del backend. Si el campo no está incluido en sortableColumns, el backend ignorará la petición de ordenamiento y la tabla no se ordenará por ese campo, aunque el frontend muestre el ícono de orden.

```typescript
sortableColumns: [
    'id_usuario_sistema',
    'nombre_usuario',
    'fecha_creacion',
    'activo',
],
```
## Paginación

La paginación en el <DataTable /> se controla mediante la propiedad initialPagination, la cual recibe un objeto con dos propiedades:

page: Número de página inicial que se mostrará en la tabla (por defecto, 1).
limit: Cantidad de elementos que se mostrarán por página (por defecto, 10).
Por ejemplo:

```typescript
<DataTable
    ...
    initialPagination={{ page: 1, limit: 10 }}
    ...
/>
```
Esto significa que la tabla mostrará la primera página y desplegará 10 elementos por página al cargar. Puedes ajustar estos valores según las necesidades de tu módulo para definir desde qué página inicia la tabla y cuántos registros se visualizan en cada página.

## Vista personalizada (cards/list)

Además del modo por defecto (tabla), `DataTable` permite una vista personalizada por item. Mantiene la misma lógica de filtros, paginación y caché, pero renderiza cada elemento con tu propio componente.

- Activa el modo con `viewMode="custom"`.
- Proporciona `renderItem={({ item, index, context }) => ... }` para pintar cada tarjeta/fila.
- Ajusta el layout con `customLayout` (grid/list, columnas, clases).

Ejemplo mínimo:

```tsx
<DataTable
    columns={[]}
    queryKey={["PAGINATION_MYENTITY"]}
    queryFn={getMyEntity}
    viewMode="custom"
    customLayout={{ type: 'grid', cols: 2 }}
    renderItem={({ item }) => (
        <Card>...usa item aquí...</Card>
    )}
/>
```