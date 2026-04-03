import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { env, queryClient } from './config';
import { WatermarkBanner } from './components/watermarks/WatermarkBanner.tsx';

const getWatermarkText = () => {
    switch (env.VITE_NODE_ENV) {
        case 'development':
            return 'DESARROLLO';
        case 'staging':
            return 'PRUEBAS';
        case 'production':
            return null;
        default:
            return 'ENTORNO NO DEFINIDO';
    }
};
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WatermarkBanner text={getWatermarkText()} />
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
);
