import pleca from '@/assets/images/pleca.svg';
import logoagn from '@/assets/images/logoagn.jpg';

export const HeaderPublic = () => {
    return (
        <header className="flex flex-col w-full shadow-md z-50">
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-1 rounded-sm shadow-sm h-14 w-auto flex items-center justify-center overflow-hidden">
                        <img 
                            src={logoagn} 
                            alt="Logo Institucional" 
                            className="h-full object-contain mix-blend-multiply" 
                        />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl uppercase tracking-wider font-patria">Sistema de Control y Desarrollo</h1>
                        <p className="text-white/80 text-sm font-medium">Área de Sistemas | Seguimiento Público</p>
                    </div>
                </div>
            </div>
            
            <div
                className="h-[10px] w-full bg-secondary"
                style={{ backgroundImage: `url(${pleca})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
        </header>
    );
};
