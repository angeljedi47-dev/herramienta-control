import { QueryClient } from '@tanstack/react-query';
import '@tanstack/react-query';
import { MutationKey, QueryKey } from './interfaces/queryInterface';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        },
    },
});

declare module '@tanstack/react-query' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        queryKey: QueryKey;
        mutationKey: MutationKey;
    }
}
