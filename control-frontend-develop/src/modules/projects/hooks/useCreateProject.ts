import { useQueryClient } from '@tanstack/react-query';
import { createProjectSchema } from '../schemas';
import { IProjectMapped } from '../interfaces';
import { createProject, updateProject } from '../apis';
import { useMutationForm } from '@/hooks';
import dayjs from 'dayjs';

interface IUseCreateProjectProps {
    onSuccess: () => void;
    projectToEdit?: IProjectMapped;
}

const useCreateProject = ({ onSuccess, projectToEdit }: IUseCreateProjectProps) => {
    const queryClient = useQueryClient();

    const { form, handleSubmit, isPending } = useMutationForm({
        schema: createProjectSchema,
        defaultValues: {
            id_proyecto: projectToEdit?.idProyecto || 0,
            nombre: projectToEdit?.nombre || '',
            descripcion: projectToEdit?.descripcion || '',
            tipo: projectToEdit?.tipo || 'Nuevo Sistema',
            estado: projectToEdit?.estado || 'Planeación',
            fecha_inicio: projectToEdit?.fechaInicio ? projectToEdit.fechaInicio : undefined,
            fecha_fin_estimada: projectToEdit?.fechaFinEstimada ? projectToEdit.fechaFinEstimada : undefined,
        },
        errorMapping: {
            id_proyecto: 'id_proyecto',
            nombre: 'nombre',
            descripcion: 'descripcion',
            tipo: 'tipo',
            estado: 'estado',
            fecha_inicio: 'fecha_inicio',
            fecha_fin_estimada: 'fecha_fin_estimada',
        },
        mutationKey: ['CREATE_PROJECT'],
        mutationFn: (data) => {
            if (projectToEdit) {
                return updateProject({
                    id_proyecto: projectToEdit.idProyecto,
                    nombre: data.nombre,
                    descripcion: data.descripcion ?? '',
                    tipo: data.tipo,
                    estado: data.estado,
                    fecha_inicio: data.fecha_inicio ? dayjs(data.fecha_inicio).format('YYYY-MM-DD') : null,
                    fecha_fin_estimada: data.fecha_fin_estimada ? dayjs(data.fecha_fin_estimada).format('YYYY-MM-DD') : null,
                });
            }
            return createProject({
                nombre: data.nombre,
                descripcion: data.descripcion ?? '',
                tipo: data.tipo,
                estado: data.estado,
                fecha_inicio: data.fecha_inicio ? dayjs(data.fecha_inicio).format('YYYY-MM-DD') : null,
                fecha_fin_estimada: data.fecha_fin_estimada ? dayjs(data.fecha_fin_estimada).format('YYYY-MM-DD') : null,
            });
        },
        cbSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['GET_PROJECTS'] });
                onSuccess();
            }
        },
    });

    return { form, handleSubmit, isPending };
};

export default useCreateProject;
