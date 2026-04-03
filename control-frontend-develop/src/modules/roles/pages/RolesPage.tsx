import { MainTitle } from '@/components/titles';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { OPERACIONES_ACCESO } from '@/const/variables_acceso';
import { CanAccess } from '@/components/CanAcces/CanAccess';
import { useCan } from '@/hooks/auth/useCan';
import { IRolesPaginatedMapped } from '../interfaces';
import RolesDialog from '../components/RolesDialog';
import TableRoles from '../components/TableRoles';
import useDeleteRol from '../hooks/useDeleteRol';

const RolesPage = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [rolToEdit, setRolToEdit] = useState<
        IRolesPaginatedMapped | undefined
    >(undefined);
    const { mutate: deleteRol } = useDeleteRol({});

    const canEdit = useCan({ operation: OPERACIONES_ACCESO.EDITAR_ROL });
    const canDelete = useCan({ operation: OPERACIONES_ACCESO.ELIMINAR_ROL });

    useEffect(() => {
        if (!openDialog) {
            if (rolToEdit) {
                setRolToEdit(undefined);
            }
        }
    }, [openDialog]);

    const setToEditRole = (rol: IRolesPaginatedMapped) => {
        setRolToEdit(rol);
        setOpenDialog(true);
    };

    const handleDeleteRole = (rol: IRolesPaginatedMapped) => {
        deleteRol(rol.idRole);
    };

    return (
        <div>
            <MainTitle title="Roles" />
            <div className="flex justify-end">
                <CanAccess operation={OPERACIONES_ACCESO.AGREGAR_ROL}>
                    <Button onClick={() => setOpenDialog(true)}>
                        <Plus />
                        Crear Rol
                    </Button>
                </CanAccess>
                <RolesDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    onSuccess={() => {
                        setOpenDialog(false);
                    }}
                    rolToEdit={rolToEdit}
                />
            </div>
            <div className="mt-4">
                <TableRoles
                    returnToEditRole={canEdit ? setToEditRole : undefined}
                    returnDeleteRole={canDelete ? handleDeleteRole : undefined}
                />
            </div>
        </div>
    );
};

export default RolesPage;
