import { Modal } from '@/components/modals';
import { Pencil, Plus } from 'lucide-react';
import { CreateUsersForm } from './CreateUsersForm';
import { ICreateUserSchema } from '../schemas';

interface IUsersDialogProps {
    userToEdit?: ICreateUserSchema;
    onSuccess: () => void;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

export const UsersDialog = ({
    userToEdit,
    onSuccess,
    openDialog,
    setOpenDialog,
}: IUsersDialogProps) => {
    const title = userToEdit ? 'Editar usuario' : 'Crear usuario';
    const icon = userToEdit ? (
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
            <CreateUsersForm
                onSuccess={() => {
                    setOpenDialog(false);
                    onSuccess();
                }}
                userToEdit={userToEdit}
            />
        </Modal>
    );
};
