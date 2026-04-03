import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { ImportMetaEnv } from './src/vite-env';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '') as unknown as ImportMetaEnv;
    return {
        plugins: [TanStackRouterVite(), react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            proxy: {
                [`/${env.VITE_API_ENDPOINT}`]: {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) =>
                        path.replace(
                            new RegExp(`^/${env.VITE_API_ENDPOINT}`),
                            '',
                        ),
                },
                [`/socket.io`]: {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
    };
});
