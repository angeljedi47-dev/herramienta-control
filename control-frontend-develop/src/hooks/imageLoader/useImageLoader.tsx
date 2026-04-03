import { useQuery } from '@tanstack/react-query';

export interface IImageLoaderOptions<T> {
    mutationFn: (params: T) => Promise<Blob>;
    params: T;
    enabled?: boolean;
}

/**
 * Hook para cargar imágenes usando React Query
 * @param options Opciones de configuración del loader
 * @returns Estado de la imagen y función para recargar
 */
export const useImageLoader = <T,>({
    mutationFn,
    params,
    enabled = true,
}: IImageLoaderOptions<T>) => {
    const {
        data: imageUrl,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['GET_IMAGE', params],
        queryFn: async () => {
            const blob = await mutationFn(params);
            return URL.createObjectURL(blob);
        },
        enabled,
        retry: false,
        gcTime: 0, // No mantener en caché para evitar memory leaks
    });

    return { imageUrl, isLoading, isError };
};
