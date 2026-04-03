import { useQuery } from '@tanstack/react-query';
import { getProjectsPublicStatus } from '../apis/projects-api';
import dayjs from 'dayjs';

const statusColors: Record<string, string> = {
    'Planeación': 'bg-slate-500',
    'Desarrollo': 'bg-blue-600',
    'Pruebas': 'bg-amber-500',
    'Liberado': 'bg-emerald-600',
};

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

    const projects = response.data;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
                Estado Público de Proyectos
            </h1>

            {projects.length === 0 ? (
                <p className="text-gray-500">No hay proyectos activos en este momento.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.idProyecto} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className={`h-2 w-full ${statusColors[project.estado] || 'bg-gray-400'}`}></div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2" title={project.nombre}>
                                    {project.nombre}
                                </h3>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-4">
                                    {project.tipo}
                                </p>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white ${statusColors[project.estado] || 'bg-gray-400'}`}>
                                        {project.estado}
                                    </span>
                                    
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {project.fechaFinEstimada ? `Fin: ${dayjs(project.fechaFinEstimada).format('MMM YYYY')}` : 'Sin fecha'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicProjectsStatus;
