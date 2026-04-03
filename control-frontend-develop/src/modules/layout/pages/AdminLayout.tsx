import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { LOCALSTORAGE_KEYS } from '@/const/localstorage.const';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLoginStore } from '@/modules/auth/store';
import { useQueryClient } from '@tanstack/react-query';
import { AppSidebar, FooterAdmin } from '../components';

export const AdminLayout = () => {
    const { resetStore } = useLoginStore();
    const { userData } = useLoginStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN_AUTH);
        resetStore();
        queryClient.clear();
        navigate({ to: '/' });
    };
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex min-h-screen max-h-screen flex-col">
                        <header className="flex h-16 bg-primary shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 h-4"
                                />
                                <div>
                                    <span className="text-primary-foreground font-medium text-sm">
                                        {userData.nombreUsuario}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4">
                                <Button
                                    variant="neutral"
                                    size={'sm'}
                                    title="Cerrar sesión"
                                    onClick={handleLogout}
                                >
                                    <LogOut />
                                </Button>
                            </div>
                        </header>
                        <div className="flex flex-col justify-between overflow-y-auto h-full">
                            <main className="p-4">
                                <Outlet />
                            </main>
                            <FooterAdmin />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
};
