import { useState } from 'react';
import { IProjectMapped } from '../interfaces';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDeleteProject } from '../hooks';
import { ProjectsDialog, TableProjects } from '../components';

const ProjectsPage = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<IProjectMapped>();
    const { deleteProjectMutate } = useDeleteProject();

    const returnDeleteProject = (project: IProjectMapped) => {
        deleteProjectMutate(project.idProyecto);
    };

    const returnToEditProject = (project: IProjectMapped) => {
        setProjectToEdit(project);
        setOpenDialog(true);
    };

    return (
        <div className="flex flex-col gap-5 pt-5">
            <div className="flex flex-row gap-5 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Proyectos</h2>
                    <p className="text-muted-foreground whitespace-pre-line hidden md:block">
                        Administra los proyectos de la secretaría
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setProjectToEdit(undefined);
                            setOpenDialog(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                    </Button>
                </div>
            </div>

            <TableProjects
                returnDeleteProject={returnDeleteProject}
                returnToEditProject={returnToEditProject}
            />

            {openDialog && (
                <ProjectsDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    projectToEdit={projectToEdit}
                    onSuccess={() => setOpenDialog(false)}
                />
            )}
        </div>
    );
};

export default ProjectsPage;
