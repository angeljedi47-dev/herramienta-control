import axios from 'axios';
import { LOCALSTORAGE_KEYS } from '@/const/localstorage.const';
import { env } from '../env';

export const api = axios.create({
    baseURL: `/${env.VITE_API_ENDPOINT}`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN_AUTH);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
