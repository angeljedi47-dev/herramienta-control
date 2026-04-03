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
            id_proyecto: projectToEdit?.idProyecto,
            nombre: projectToEdit?.nombre || '',
            descripcion: projectToEdit?.descripcion || '',
            tipo: projectToEdit?.tipo || undefined,
            id_estado_proyecto: projectToEdit?.id_estado_proyecto || undefined,
            fecha_inicio: projectToEdit?.fechaInicio ? projectToEdit.fechaInicio : undefined,
            fecha_fin_estimada: projectToEdit?.fechaFinEstimada ? projectToEdit.fechaFinEstimada : undefined,
            porcentaje: projectToEdit?.porcentaje || 0,
            id_tipo_informe: projectToEdit?.id_tipo_informe || undefined,
        },
        errorMapping: {
            id_proyecto: 'id_proyecto',
            nombre: 'nombre',
            descripcion: 'descripcion',
            tipo: 'tipo',
            id_estado_proyecto: 'id_estado_proyecto',
            fecha_inicio: 'fecha_inicio',
            fecha_fin_estimada: 'fecha_fin_estimada',
            porcentaje: 'porcentaje',
            id_tipo_informe: 'id_tipo_informe',
        },
        mutationKey: ['CREATE_PROJECT'],
        mutationFn: (data) => {
            if (projectToEdit) {
                return updateProject({
                    id_proyecto: data.id_proyecto,
                    nombre: data.nombre,
                    descripcion: data.descripcion ?? '',
                    tipo: data.tipo,
                    id_estado_proyecto: data.id_estado_proyecto,
                    fecha_inicio: data.fecha_inicio ? dayjs(data.fecha_inicio).format('YYYY-MM-DD') : null,
                    fecha_fin_estimada: data.fecha_fin_estimada ? dayjs(data.fecha_fin_estimada).format('YYYY-MM-DD') : null,
                    porcentaje: data.porcentaje ?? 0,
                    id_tipo_informe: data.id_tipo_informe,
                });
            }
            return createProject({
                nombre: data.nombre,
                descripcion: data.descripcion ?? '',
                tipo: data.tipo,
                id_estado_proyecto: data.id_estado_proyecto,
                fecha_inicio: data.fecha_inicio ? dayjs(data.fecha_inicio).format('YYYY-MM-DD') : null,
                fecha_fin_estimada: data.fecha_fin_estimada ? dayjs(data.fecha_fin_estimada).format('YYYY-MM-DD') : null,
                porcentaje: data.porcentaje ?? 0,
                id_tipo_informe: data.id_tipo_informe,
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
