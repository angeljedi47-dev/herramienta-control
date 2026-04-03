import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    SortingState,
} from '@tanstack/react-table';

import { useState, useEffect } from 'react';
import {
    IPaginationQuery,
    IFilterOperator,
    IDataTableProps,
} from './interfaces';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DataTableContent } from './DataTableContent';
import { DataTablePagination } from './DataTablePagination';
import { DataTablePageSize } from './DataTablePageSize';
import { DataTableFilters } from './filters';
import { ActionMenu } from '../actions/ActionMenu';
import { PAGE_SIZE_OPTIONS } from './const';
import { DataTableActions } from './DataTableActions';
import { DataListContent } from './DataListContent';

export function DataTable<TData, TValue>({
    columns,
    actions,
    queryKey,
    queryFn,
    initialPagination = { page: 1, limit: 10 },
    filterFields,
    filterOnChange = true,
    viewMode = 'table',
    renderItem,
    customLayout,
    actionsTable,
}: IDataTableProps<TData, TValue>) {
    const [pagination, setPagination] =
        useState<IPaginationQuery>(initialPagination);
    const [sorting, setSorting] = useState<SortingState>([]);

    const resetToInitial = () => {
        setPagination(initialPagination);
        setSorting([]);
    };

    // Efecto para manejar cambios en el sorting
    useEffect(() => {
        if (!sorting.length) {
            setPagination((prev) => ({ ...prev, sortBy: undefined }));
            return;
        }

        const sortAndOrder = sorting.reduce<{
            fields: string[];
            directions: string[];
        }>(
            (acc, sortState) => {
                acc.fields.push(sortState.id);
                acc.directions.push(sortState.desc ? 'DESC' : 'ASC');
                return acc;
            },
            { fields: [], directions: [] },
        );

        setPagination((prev) => ({
            ...prev,
            sortBy: sortAndOrder.fields.map(
                (field, index) => `${field}:${sortAndOrder.directions[index]}`,
            ),
        }));
    }, [sorting]);

    const handleFilterChange = (
        filters: {
            [key: string]: string | IFilterOperator;
        },
        shouldReset = false,
    ) => {
        if (shouldReset) {
            resetToInitial();
            return;
        }

        const formattedFilters = Object.entries(filters).reduce(
            (acc, [key, value]) => {
                if (typeof value === 'string') {
                    acc[`filter.${key}`] = value;
                }
                return acc;
            },
            {} as { [key: string]: string },
        );

        // Crear un nuevo objeto de paginación
        const newPagination: Record<string, string | number | string[]> = {
            ...initialPagination,
            ...formattedFilters,
            page: 1,
        };

        // Agregar el ordenamiento a la paginación
        if (sorting.length > 0) {
            sorting.forEach((sort) => {
                const orderByValue = `${sort.id}:${sort.desc ? 'DESC' : 'ASC'}`;
                const orderByKey = 'orderBy';

                // Si ya existe un orderBy, agregarlo como un nuevo parámetro
                const existingKeys = Object.keys(newPagination);
                const orderByCount = existingKeys.filter(
                    (k) => k === orderByKey,
                ).length;

                if (orderByCount === 0) {
                    newPagination[orderByKey] = orderByValue;
                } else {
                    newPagination[`${orderByKey}`] = orderByValue;
                }
            });
        }

        setPagination(newPagination as IPaginationQuery);
    };

    const queryResult = useQuery({
        queryKey: [...queryKey, pagination],
        queryFn: () => queryFn(pagination),
        placeholderData: keepPreviousData,
    });

    const { data: queryResponse, isLoading, isFetching } = queryResult;

    const data = queryResponse?.data?.data ?? [];
    const meta = queryResponse?.data?.meta;

    const withActionsColumn =
        actions?.some((action) => !action.disabled) && viewMode === 'table';

    const allColumns: ColumnDef<TData, TValue>[] = [
        ...(withActionsColumn
            ? [
                  {
                      id: 'actions',
                      cell: ({ row }) => (
                          <ActionMenu
                              actions={actions ?? []}
                              data={row.original}
                          />
                      ),
                      size: 50,
                      header: 'Acciones',
                      enableSorting: false,
                  } as ColumnDef<TData, TValue>,
              ]
            : []),
        ...columns,
    ];

    const table =
        viewMode === 'table'
            ? useReactTable({
                  data,
                  columns: allColumns,
                  getCoreRowModel: getCoreRowModel(),
                  manualPagination: true,
                  pageCount: meta?.totalPages,
                  state: {
                      sorting,
                  },
                  onSortingChange: setSorting,
                  manualSorting: true,
                  enableMultiSort: true,
                  isMultiSortEvent: () => true,
              })
            : undefined;

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: string) => {
        setPagination((prev) => ({
            ...prev,
            page: 1,
            limit: parseInt(newLimit),
        }));
    };

    return (
        <div className="space-y-4">
            {filterFields && (
                <DataTableFilters
                    fields={filterFields}
                    onFilterChange={handleFilterChange}
                    filterOnChange={filterOnChange}
                />
            )}
            {actionsTable && (
                <DataTableActions
                    pagination={pagination}
                    data={data}
                    actions={actionsTable}
                />
            )}
            <DataTablePageSize
                value={pagination.limit || 10}
                options={PAGE_SIZE_OPTIONS}
                onChange={handleLimitChange}
            />

            {viewMode === 'table' ? (
                <DataTableContent<TData, TValue>
                    table={table!}
                    columns={allColumns}
                    isLoading={isLoading}
                    data={data}
                />
            ) : renderItem ? (
                <DataListContent<TData>
                    data={data}
                    isLoading={isLoading}
                    renderItem={renderItem}
                    layout={customLayout}
                    actions={actions}
                    queryResult={queryResult}
                />
            ) : (
                <div className="rounded-lg border bg-white shadow-sm p-8 text-center text-gray-500">
                    <p>Falta la prop renderItem para vista personalizada.</p>
                </div>
            )}
            {meta && (
                <DataTablePagination
                    currentPage={meta.currentPage || 1}
                    totalPages={meta.totalPages || 1}
                    itemsPerPage={meta.itemsPerPage || 10}
                    totalItems={meta.totalItems || 0}
                    onPageChange={handlePageChange}
                    isLoading={isFetching}
                />
            )}
        </div>
    );
}
