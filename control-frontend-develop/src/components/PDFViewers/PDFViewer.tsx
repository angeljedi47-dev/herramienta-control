import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Document, Page, Thumbnail } from 'react-pdf';
import { saveAs } from 'file-saver';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    ZoomIn,
    ZoomOut,
    Layers,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface IPDFViewerProps {
    pdfBlob: Blob;
    fileName: string;
}

const PDFViewer = ({ pdfBlob, fileName }: IPDFViewerProps) => {
    // Estados
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
    const [pageInputValue, setPageInputValue] = useState<string>('1');
    const [pdfUrl, setPdfUrl] = useState<string>('');

    // Estados para prevenir parpadeo al hacer zoom
    const [renderKey, setRenderKey] = useState<string>('0');
    const [prevRenderKey, setPrevRenderKey] = useState<string | null>(null);

    // Refs para mantener la posición del scroll
    const viewerRef = useRef<HTMLDivElement>(null);
    const previousScaleRef = useRef<number>(1.0);
    const scrollPosRef = useRef({ x: 0, y: 0 });
    const shouldRestoreScrollRef = useRef<boolean>(false);

    // Crear URL del blob para react-pdf
    useEffect(() => {
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [pdfBlob]);

    // Guardar posición antes de cambiar scale
    const handleZoomChange = (newScale: number) => {
        if (viewerRef.current) {
            const viewer = viewerRef.current;
            // Guardar posición relativa (porcentaje del scroll)
            const scrollXPercent =
                viewer.scrollLeft / (viewer.scrollWidth - viewer.clientWidth);
            const scrollYPercent =
                viewer.scrollTop / (viewer.scrollHeight - viewer.clientHeight);

            scrollPosRef.current = {
                x: isNaN(scrollXPercent) ? 0 : scrollXPercent,
                y: isNaN(scrollYPercent) ? 0 : scrollYPercent,
            };
        }

        // Marcar que debemos restaurar el scroll (solo para zoom)
        shouldRestoreScrollRef.current = true;

        // Cambiar keys para mantener la página anterior mientras se renderiza la nueva
        setPrevRenderKey(renderKey);
        setRenderKey(`${currentPage}-${newScale}`);

        previousScaleRef.current = scale;
        setScale(newScale);
    };

    // Callback cuando la página termina de renderizarse
    const onPageRenderSuccess = () => {
        // Limpiar la página anterior una vez que la nueva está lista
        setPrevRenderKey(null);

        if (!viewerRef.current) return;

        const viewer = viewerRef.current;

        // Solo restaurar scroll si es un cambio de zoom (no de página)
        if (shouldRestoreScrollRef.current) {
            const { x, y } = scrollPosRef.current;

            // Restaurar posición relativa después del render
            requestAnimationFrame(() => {
                const maxScrollX = viewer.scrollWidth - viewer.clientWidth;
                const maxScrollY = viewer.scrollHeight - viewer.clientHeight;

                viewer.scrollLeft = x * maxScrollX;
                viewer.scrollTop = y * maxScrollY;
            });

            shouldRestoreScrollRef.current = false;
        } else {
            // Si es cambio de página, resetear al top
            requestAnimationFrame(() => {
                viewer.scrollTop = 0;
                viewer.scrollLeft = 0;
            });
        }
    };

    // Callback cuando el documento se carga exitosamente
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setCurrentPage(1);
        setPageInputValue('1');
    };

    // Navegación - Página anterior
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setPrevRenderKey(renderKey);
            setRenderKey(`${newPage}-${scale}`);
            setCurrentPage(newPage);
            setPageInputValue(newPage.toString());
        }
    };

    // Navegación - Página siguiente
    const goToNextPage = () => {
        if (currentPage < numPages) {
            const newPage = currentPage + 1;
            setPrevRenderKey(renderKey);
            setRenderKey(`${newPage}-${scale}`);
            setCurrentPage(newPage);
            setPageInputValue(newPage.toString());
        }
    };

    // Navegación - Ir a página específica desde thumbnail
    const onThumbnailClick = ({ pageNumber }: { pageNumber: number }) => {
        setPrevRenderKey(renderKey);
        setRenderKey(`${pageNumber}-${scale}`);
        setCurrentPage(pageNumber);
        setPageInputValue(pageNumber.toString());

        // Scroll al área principal
        document.getElementById('pdf-main-viewer')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    // Manejar cambio en el input de página
    const handlePageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPageInputValue(value);
    };

    // Manejar envío del input de página
    const handlePageInputSubmit = () => {
        const pageNumber = parseInt(pageInputValue, 10);

        if (isNaN(pageNumber)) {
            setPageInputValue(currentPage.toString());
            return;
        }

        let newPage = pageNumber;
        if (pageNumber < 1) {
            newPage = 1;
        } else if (pageNumber > numPages) {
            newPage = numPages;
        }

        if (newPage !== currentPage) {
            setPrevRenderKey(renderKey);
            setRenderKey(`${newPage}-${scale}`);
        }

        setCurrentPage(newPage);
        setPageInputValue(newPage.toString());
    };

    // Zoom - Acercar
    const handleZoomIn = () => {
        handleZoomChange(Math.min(scale + 0.1, 3.0));
    };

    // Zoom - Alejar
    const handleZoomOut = () => {
        handleZoomChange(Math.max(scale - 0.1, 0.5));
    };

    // Resetear zoom
    const handleResetZoom = () => {
        handleZoomChange(1.0);
    };

    // Descargar PDF
    const handleDownload = () => {
        saveAs(pdfBlob, fileName);
    };

    // Toggle sidebar de thumbnails
    const toggleThumbnails = () => {
        setShowThumbnails((prev) => !prev);
    };

    return (
        <TooltipProvider>
            <Card className="w-full h-full overflow-hidden">
                {/* Vista móvil - Solo nombre y descarga */}
                <div className="md:hidden flex flex-col items-center justify-center h-full p-6 gap-4">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Archivo PDF
                        </p>
                        <p className="text-lg font-semibold break-all">
                            {fileName}
                        </p>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownload}
                        className="w-full max-w-xs"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        Descargar PDF
                    </Button>
                </div>

                {/* Vista desktop - Visor completo */}
                <div className="hidden md:flex flex-col h-full">
                    {/* Header con controles */}
                    <div className="flex items-center justify-between gap-2 p-4 bg-muted/50 border-b flex-wrap">
                        {/* Controles de navegación */}
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToPreviousPage}
                                        disabled={currentPage <= 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Página anterior</p>
                                </TooltipContent>
                            </Tooltip>

                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={pageInputValue}
                                    onChange={handlePageInputChange}
                                    onBlur={handlePageInputSubmit}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handlePageInputSubmit();
                                        }
                                    }}
                                    className="w-16 text-center"
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    de {numPages || '---'}
                                </span>
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToNextPage}
                                        disabled={currentPage >= numPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Página siguiente</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Controles de zoom */}
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleZoomOut}
                                        disabled={scale <= 0.5}
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Alejar</p>
                                </TooltipContent>
                            </Tooltip>

                            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                                {Math.round(scale * 100)}%
                            </span>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleZoomIn}
                                        disabled={scale >= 3.0}
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Acercar</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleResetZoom}
                                        disabled={scale === 1.0}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Resetear zoom</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Controles adicionales */}
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={toggleThumbnails}
                                    >
                                        <Layers className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {showThumbnails
                                            ? 'Ocultar miniaturas'
                                            : 'Mostrar miniaturas'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="icon"
                                        onClick={handleDownload}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Descargar PDF</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Contenedor principal */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar de thumbnails */}
                        {showThumbnails && (
                            <div className="w-48 border-r bg-muted/30 overflow-y-auto p-2 space-y-2">
                                <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                                    PÁGINAS
                                </div>
                                {pdfUrl && (
                                    <Document
                                        file={pdfUrl}
                                        loading={
                                            <div className="text-xs text-muted-foreground p-2">
                                                Cargando...
                                            </div>
                                        }
                                        onItemClick={({ pageNumber }) => {
                                            if (pageNumber) {
                                                onThumbnailClick({
                                                    pageNumber,
                                                });
                                            }
                                        }}
                                    >
                                        {Array.from(
                                            new Array(numPages),
                                            (_, index) => (
                                                <div
                                                    key={`thumb_${index + 1}`}
                                                    className={`
                                                        cursor-pointer rounded-md overflow-hidden
                                                        border-2 transition-all hover:border-primary/50
                                                        ${
                                                            currentPage ===
                                                            index + 1
                                                                ? 'border-primary shadow-md'
                                                                : 'border-border'
                                                        }
                                                    `}
                                                    onClick={() =>
                                                        onThumbnailClick({
                                                            pageNumber:
                                                                index + 1,
                                                        })
                                                    }
                                                >
                                                    <Thumbnail
                                                        pageNumber={index + 1}
                                                        width={160}
                                                    />
                                                    <div className="text-center text-xs py-1 bg-background">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </Document>
                                )}
                            </div>
                        )}

                        {/* Visor principal del PDF */}
                        <div
                            ref={viewerRef}
                            id="pdf-main-viewer"
                            className="flex-1 overflow-auto bg-muted/20"
                        >
                            {pdfUrl ? (
                                <div
                                    className="p-4"
                                    style={{
                                        display: 'grid',
                                        placeItems: 'center',
                                        minWidth: '100%',
                                        minHeight: '100%',
                                    }}
                                >
                                    <Document
                                        file={pdfUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onItemClick={({ pageNumber }) => {
                                            if (pageNumber) {
                                                onThumbnailClick({
                                                    pageNumber,
                                                });
                                            }
                                        }}
                                        loading={
                                            <div className="flex items-center justify-center min-h-[400px]">
                                                <div className="text-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Cargando documento...
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                        error={
                                            <div className="flex items-center justify-center min-h-[400px]">
                                                <div className="text-center text-destructive">
                                                    <p className="font-semibold mb-2">
                                                        Error al cargar el PDF
                                                    </p>
                                                    <p className="text-sm">
                                                        No se pudo cargar el
                                                        documento
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                        className="pdf-document"
                                    >
                                        <div className="relative">
                                            {/* Página anterior (se mantiene visible durante el render) */}
                                            {prevRenderKey && (
                                                <div
                                                    key={prevRenderKey}
                                                    className="shadow-lg bg-white"
                                                    style={{
                                                        willChange: 'transform',
                                                    }}
                                                >
                                                    <Page
                                                        pageNumber={currentPage}
                                                        scale={
                                                            previousScaleRef.current
                                                        }
                                                        renderAnnotationLayer={
                                                            true
                                                        }
                                                        renderTextLayer={true}
                                                        className="pdf-page"
                                                        loading=""
                                                    />
                                                </div>
                                            )}

                                            {/* Página actual (nueva) */}
                                            <div
                                                key={renderKey}
                                                className="shadow-lg bg-white"
                                                style={{
                                                    willChange: 'transform',
                                                    position: prevRenderKey
                                                        ? 'absolute'
                                                        : 'relative',
                                                    top: 0,
                                                    left: 0,
                                                    opacity: prevRenderKey
                                                        ? 0
                                                        : 1,
                                                }}
                                            >
                                                <Page
                                                    pageNumber={currentPage}
                                                    scale={scale}
                                                    renderAnnotationLayer={true}
                                                    renderTextLayer={true}
                                                    className="pdf-page"
                                                    onRenderSuccess={
                                                        onPageRenderSuccess
                                                    }
                                                    loading=""
                                                />
                                            </div>
                                        </div>
                                    </Document>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                    <p className="text-sm text-muted-foreground">
                                        Preparando documento...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </TooltipProvider>
    );
};

export default PDFViewer;
