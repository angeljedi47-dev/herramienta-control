import { Modal } from '@/components/modals';
import { Pencil, Plus } from 'lucide-react';
import CreateRolForm from './CreateRolForm';
import { IRolesPaginatedMapped } from '../interfaces';

interface IRolesDialogProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    returnOnClose?: () => void;
    onSuccess: () => void;
    rolToEdit?: IRolesPaginatedMapped;
}

const RolesDialog = ({
    openDialog,
    setOpenDialog,
    onSuccess,
    rolToEdit,
}: IRolesDialogProps) => {
    const title = rolToEdit ? 'Editar Rol' : 'Crear Rol';
    const icon = rolToEdit ? (
        <Pencil className="mr-2" />
    ) : (
        <Plus className="mr-2" />
    );

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
            <CreateRolForm
                rolToEdit={rolToEdit}
                onSuccess={() => {
                    setOpenDialog(false);
                    onSuccess();
                }}
            />
        </Modal>
    );
};

export default RolesDialog;
