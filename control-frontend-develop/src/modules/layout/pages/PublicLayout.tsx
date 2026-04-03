import { ReactNode } from 'react';
import { FooterAdmin } from '../components/FooterAdmin';
import { HeaderPublic } from '../components/HeaderPublic';

export const PublicLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 w-full relative">
            <HeaderPublic />
            
            <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
                {children}
            </main>

            <FooterAdmin />
        </div>
    );
};
