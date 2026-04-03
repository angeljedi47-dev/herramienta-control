import { MainTitle } from '@/components/titles';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OPERACIONES_ACCESO } from '@/const/variables_acceso';
import { CanAccess } from '@/components/CanAcces/CanAccess';
import { useCan } from '@/hooks/auth/useCan';
import { UsersDialog } from '../components/UsersDialog';
import useDeleteUser from '../hooks/useDeleteUser';
import useRestoreUser from '../hooks/useRestoreUser';
import { IUserPaginatedMapped } from '../interfaces';
import { TableUser } from '../components/TableUser';

export const UsersPage = () => {
    const { mutate: deleteUserMutation } = useDeleteUser({});
    const { mutate: restoreUserMutation } = useRestoreUser({});
    const [userToEdit, setUserToEdit] = useState<
        undefined | IUserPaginatedMapped
    >(undefined);
    const [openDialog, setOpenDialog] = useState(false);

    const canEdit = useCan({ operation: OPERACIONES_ACCESO.EDITAR_USUARIO });
    const canDelete = useCan({
        operation: OPERACIONES_ACCESO.ELIMINAR_USUARIO,
    });
    const canRestore = useCan({
        operation: OPERACIONES_ACCESO.RESTAURAR_USUARIO,
    });

    useEffect(() => {
        if (!openDialog) {
            if (userToEdit) {
                setUserToEdit(undefined);
            }
        }
    }, [openDialog]);

    const handleSetUserToEdit = (user: IUserPaginatedMapped) => {
        setUserToEdit(user);
        setOpenDialog(true);
    };

    const handleDeleteUser = (user: IUserPaginatedMapped) => {
        deleteUserMutation(user.idUsuarioSistema);
    };

    const handleRestoreUser = (user: IUserPaginatedMapped) => {
        restoreUserMutation(user.idUsuarioSistema);
    };

    return (
        <>
            <MainTitle title="Usuarios" />
            <div className="flex justify-end">
                <CanAccess operation={OPERACIONES_ACCESO.AGREGAR_USUARIO}>
                    <Button onClick={() => setOpenDialog(true)}>
                        <Plus />
                        Crear usuario
                    </Button>
                </CanAccess>
                <UsersDialog
                    userToEdit={
                        userToEdit
                            ? {
                                  nombreUsuario:
                                      userToEdit?.nombreUsuario || '',
                                  roles: userToEdit?.roles || [],
                                  idUsuario: userToEdit?.idUsuarioSistema || 0,
                              }
                            : undefined
                    }
                    onSuccess={() => {
                        setUserToEdit(undefined);
                    }}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                />
            </div>
            <div className="mt-4">
                <TableUser
                    returnToEditUser={canEdit ? handleSetUserToEdit : undefined}
                    returnDeleteUser={canDelete ? handleDeleteUser : undefined}
                    returnRestoreUser={
                        canRestore ? handleRestoreUser : undefined
                    }
                />
            </div>
        </>
    );
};
