import { Modal } from '@/components/modals';
import { Pencil, Plus } from 'lucide-react';
import ProjectForm from './ProjectForm';
import { IProjectMapped } from '../interfaces';

interface IProjectsDialogProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    onSuccess: () => void;
    projectToEdit?: IProjectMapped;
}

const ProjectsDialog = ({
    openDialog,
    setOpenDialog,
    onSuccess,
    projectToEdit,
}: IProjectsDialogProps) => {
    const title = projectToEdit ? 'Editar Proyecto' : 'Crear Proyecto';
    const icon = projectToEdit ? <Pencil className="mr-2" /> : <Plus className="mr-2" />;

    return (
        <Modal
            title={title}
            open={openDialog}
            onOpenChange={setOpenDialog}
            shouldConfirmClose={true}
        >
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                {icon}
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <ProjectForm
                projectToEdit={projectToEdit}
                onSuccess={() => {
                    setOpenDialog(false);
                    onSuccess();
                }}
            />
        </Modal>
    );
};

export default ProjectsDialog;
