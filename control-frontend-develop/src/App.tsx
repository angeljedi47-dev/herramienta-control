import { useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { useLoginStore } from './modules/auth/store';
import { AppRouter } from './config/router';
import PendingComponentData from './components/loaders/PendingComponentData';
import ErrorComponentRoute from './components/errors/ErrorComponentRoute';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.js',
    import.meta.url,
).toString();

function App() {
    const { authenticated } = useLoginStore();
    const { setAuthenticated } = useLoginStore();
    const { setPermisos } = useLoginStore();
    const { permisos } = useLoginStore();
    const { setUserData } = useLoginStore();
    const queryClient = useQueryClient();

    return (
        <>
            <AppRouter
                context={{
                    authenticated,
                    setAuthenticated,
                    setPermisos,
                    modulos: permisos.modulos,
                    queryClient,
                    setUserData,
                }}
                pendingComponent={PendingComponentData}
                errorComponent={ErrorComponentRoute}
            />
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
}

export default App;
