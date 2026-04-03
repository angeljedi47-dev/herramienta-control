import { Button } from '@/components/ui/button';
import { DataTableGoToPage } from './DataTableGoToPage';
import { useMediaQuery } from '@/hooks/mediaQuery';
import { IDataTablePaginationProps } from './interfaces';

export function DataTablePagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    isLoading = false,
}: IDataTablePaginationProps) {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const maxVisiblePages = isMobile ? 3 : 5;

    const renderPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2),
        );
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages.map((page, index) =>
            typeof page === 'number' ? (
                <Button
                    key={index}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size={isMobile ? 'icon' : 'sm'}
                    onClick={() => onPageChange(page)}
                    className={`min-w-[2rem] ${
                        currentPage === page
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : ''
                    }`}
                >
                    {page}
                </Button>
            ) : (
                <span
                    key={index}
                    className="flex items-center justify-center px-1 text-muted-foreground"
                    aria-hidden="true"
                >
                    {page}
                </span>
            ),
        );
    };

    return (
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
                <span className="hidden sm:inline">Mostrando </span>
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)}
                <span className="hidden sm:inline"> de </span>
                <span className="inline sm:hidden">/</span>
                {totalItems}
                <span className="hidden sm:inline"> registros</span>
            </div>
            <div
                className={`flex items-center justify-center gap-1 sm:gap-2 ${isLoading ? 'opacity-70' : ''}`}
            >
                {!isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1 || isLoading}
                        className="hidden sm:flex"
                    >
                        Primera
                    </Button>
                )}
                <Button
                    variant="outline"
                    size={isMobile ? 'icon' : 'sm'}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    aria-label="Página anterior"
                >
                    {isMobile ? '←' : 'Anterior'}
                </Button>
                <div className="flex items-center gap-1">
                    {renderPageNumbers()}
                </div>
                <Button
                    variant="outline"
                    size={isMobile ? 'icon' : 'sm'}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    aria-label="Página siguiente"
                >
                    {isMobile ? '→' : 'Siguiente'}
                </Button>
                {!isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage >= totalPages || isLoading}
                        className="hidden sm:flex"
                    >
                        Última
                    </Button>
                )}
                <div className="flex items-center gap-1 ml-2 border-l pl-2">
                    <DataTableGoToPage
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
