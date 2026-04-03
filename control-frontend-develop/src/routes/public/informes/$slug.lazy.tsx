import { createLazyFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getTipoInformePublicStatus } from '@/modules/tipos-informe/apis/tiposInforme.api';
import { PublicLayout } from '@/modules/layout/pages/PublicLayout';
import dayjs from 'dayjs';

export const Route = createLazyFileRoute('/public/informes/$slug')({
    component: RouteComponent,
});

function RouteComponent() {
    const { slug } = Route.useParams();

    const { data: tipoInforme, isLoading, isError } = useQuery({
        queryKey: ['GET_TIPO_INFORME_PUBLIC_STATUS', slug],
        queryFn: () => getTipoInformePublicStatus(slug),
    });

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="p-8 text-center text-gray-500">Cargando estado de informe...</div>
            </PublicLayout>
        );
    }

    if (isError || !tipoInforme) {
        return (
            <PublicLayout>
                <div className="p-8 text-center text-red-500">Error al cargar la información pública o el tipo de informe no existe.</div>
            </PublicLayout>
        );
    }

    const projects = tipoInforme.proyectos || [];
    const ongoingProjects = projects.filter((p: any) => !p.estadoProyecto?.es_final);
    const finishedProjects = projects.filter((p: any) => p.estadoProyecto?.es_final);

    const renderProjectList = (projList: any[]) => (
        <div className="flex flex-col gap-6 w-full">
            {projList.map((project: any) => (
                <div key={project.id_proyecto} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="h-2 w-full" style={{ backgroundColor: project.estadoProyecto?.color_hex || '#9ca3af' }}></div>
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2" title={project.nombre}>
                            {project.nombre}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-4">
                            {project.tipo}
                        </p>
                        
                        <div className="flex items-center justify-between mt-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: project.estadoProyecto?.color_hex || '#9ca3af' }}>
                                {project.estadoProyecto?.nombre || 'Sin Estado'}
                            </span>
                            
                            <div className="text-right">
                                <p className="text-xs text-gray-500">
                                    {project.fecha_fin_estimada ? `Fin: ${dayjs(project.fecha_fin_estimada).format('MMM YYYY')}` : 'Sin fecha'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                                <span>Progreso del Proyecto</span>
                                <span>{project.porcentaje || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${project.porcentaje || 0}%`, backgroundColor: project.porcentaje === 100 ? '#10b981' : '#3b82f6' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <PublicLayout>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                Informes: {tipoInforme.nombre}
            </h1>
            <div className="text-sm text-gray-500 border-b pb-4 mb-8">Estado actual y progreso de todos los reportes asociados</div>

            {projects.length === 0 ? (
                <p className="text-gray-500">No hay informes activos en este catálogo.</p>
            ) : (
                <div className="space-y-12">
                    {ongoingProjects.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Informes en Proceso
                            </h2>
                            {renderProjectList(ongoingProjects)}
                        </div>
                    )}
                    
                    {finishedProjects.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2 mt-8 pt-8 border-t">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                Informes Finalizados
                            </h2>
                            {renderProjectList(finishedProjects)}
                        </div>
                    )}
                </div>
            )}
        </PublicLayout>
    );
}
