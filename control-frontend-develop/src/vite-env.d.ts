/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

export interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_NODE_ENV: 'development' | 'production' | 'staging';
    readonly VITE_API_ENDPOINT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
