import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { flexRender } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IDataTableContentProps } from './interfaces';

export function DataTableContent<TData, TValue>({
    table,
    columns,
    isLoading,
    data,
}: IDataTableContentProps<TData, TValue>) {
    return (
        <div className="rounded-lg border bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="hover:bg-transparent border-b border-gray-200"
                        >
                            {headerGroup.headers.map((header) => {
                                const canSort = header.column.getCanSort();
                                const sortIndex = header.column.getSortIndex();
                                const sortDirection =
                                    header.column.getIsSorted();

                                return (
                                    <TableHead
                                        key={header.id}
                                        className="py-4 first:pl-6 last:pr-6"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center gap-2">
                                                {canSort ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={cn(
                                                            '-ml-3 font-medium text-gray-700 hover:bg-gray-100 transition-colors',
                                                            sortDirection &&
                                                                'text-primary',
                                                        )}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        {sortDirection ===
                                                            false && (
                                                            <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-gray-500" />
                                                        )}
                                                        {sortDirection ===
                                                            'asc' && (
                                                            <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />
                                                        )}
                                                        {sortDirection ===
                                                            'desc' && (
                                                            <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
                                                        )}
                                                        {sortIndex > -1 && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="ml-2 h-5 px-1.5"
                                                            >
                                                                {sortIndex + 1}
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <span className="font-medium text-gray-700">
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={`skeleton-${index}`}>
                                {columns.map((_, colIndex) => (
                                    <TableCell
                                        key={`skeleton-cell-${colIndex}`}
                                        className="py-3 first:pl-6 last:pr-6"
                                    >
                                        <Skeleton className="h-5 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : data.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="py-3 first:pl-6 last:pr-6"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-32 text-center text-gray-500"
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <svg
                                        className="h-8 w-8 text-gray-400"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>No hay resultados disponibles</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
