import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../apis';
import { toast } from 'sonner';

const useDeleteProject = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            toast.success('Proyecto eliminado correctamente');
            queryClient.invalidateQueries({ queryKey: ['GET_PROJECTS'] });
        },
        onError: () => {
            toast.error('Ocurrió un error al eliminar el proyecto');
        },
    });

    return { deleteProjectMutate: mutate, isPending };
};

export default useDeleteProject;
