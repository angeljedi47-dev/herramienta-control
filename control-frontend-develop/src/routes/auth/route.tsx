import { LOCALSTORAGE_KEYS } from '@/const/localstorage.const';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
    beforeLoad: () => {
        if (localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN_AUTH)) {
            throw redirect({ to: '/admin' });
        }
    },
});
