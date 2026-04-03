import { useQuery } from '@tanstack/react-query';
import { getProjectsPublicStatus } from '../apis/projects-api';
import dayjs from 'dayjs';

const PublicProjectsStatus = () => {
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['GET_PROJECTS_PUBLIC_STATUS'],
        queryFn: getProjectsPublicStatus,
    });

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Cargando estado de proyectos...</div>;
    }

    if (isError || !response) {
        return <div className="p-8 text-center text-red-500">Error al cargar la información pública.</div>;
    }

    const projects = response.data || [];
    const ongoingProjects = projects.filter((p: any) => !p.estadoProyecto?.es_final);
    const finishedProjects = projects.filter((p: any) => p.estadoProyecto?.es_final);

    const renderProjectList = (projList: any[]) => (
        <div className="flex flex-col gap-6 w-full">
            {projList.map((project: any) => (
                <div key={project.idProyecto} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
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
                                    {project.fechaFinEstimada ? `Fin: ${dayjs(project.fechaFinEstimada).format('MMM YYYY')}` : 'Sin fecha'}
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
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
                Estado Público de Proyectos
            </h1>

            {projects.length === 0 ? (
                <p className="text-gray-500">No hay proyectos activos en este momento.</p>
            ) : (
                <div className="space-y-12">
                    {ongoingProjects.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Sistemas en Proceso
                            </h2>
                            {renderProjectList(ongoingProjects)}
                        </div>
                    )}
                    
                    {finishedProjects.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2 mt-8 pt-8 border-t">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                Sistemas Finalizados
                            </h2>
                            {renderProjectList(finishedProjects)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PublicProjectsStatus;
