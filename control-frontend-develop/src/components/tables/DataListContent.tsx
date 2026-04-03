import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { IAction } from '@/components/actions/ActionMenu';
import type {
    ICustomItemRendererProps,
    ICustomLayoutOptions,
    IPaginationResponse,
    IResponse,
} from './interfaces';
import { AnimatePresence } from 'framer-motion';
import { UseQueryResult } from '@tanstack/react-query';

interface IDataListContentProps<TData> {
    data: TData[];
    isLoading: boolean;
    renderItem: (props: ICustomItemRendererProps<TData>) => React.ReactNode;
    layout?: ICustomLayoutOptions;
    actions?: IAction<TData>[];
    queryResult: UseQueryResult<IResponse<IPaginationResponse<TData>>, Error>;
}

export function DataListContent<TData>({
    data,
    isLoading,
    renderItem,
    layout = { type: 'grid', cols: 3 },
    actions,
    queryResult,
}: IDataListContentProps<TData>) {
    const wrapperClass =
        layout.type === 'list'
            ? cn('divide-y')
            : cn(
                  'grid gap-4',
                  layout.cols === 1 && 'grid-cols-1',
                  layout.cols === 2 && 'grid-cols-1 md:grid-cols-2',
                  layout.cols === 3 &&
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                  layout.cols === 4 &&
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
                  layout.className,
              );
    if (isLoading) {
        return (
            <div className={cn('rounded-lg border bg-white shadow-sm p-4')}>
                <div className={wrapperClass}>
                    {Array.from({ length: (layout.cols ?? 3) * 2 }).map(
                        (_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="space-y-3 p-4 border rounded-lg"
                            >
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ),
                    )}
                </div>
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="rounded-lg border bg-white shadow-sm p-8 text-center text-gray-500">
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
            </div>
        );
    }

    return (
        <div className={cn('rounded-lg border bg-white shadow-sm p-4')}>
            <div className={wrapperClass}>
                <AnimatePresence mode="popLayout">
                    {data.map((item, index) => {
                        return renderItem({
                            item,
                            index,
                            context: { actions },
                            queryResult,
                        });
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
