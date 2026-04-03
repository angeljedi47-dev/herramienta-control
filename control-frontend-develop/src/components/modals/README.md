# Componente Modal

Un componente modal personalizable y reutilizable que abstrae la complejidad del `Dialog` de shadcn/ui, proporcionando una interfaz simplificada y flexible.

## Características

✅ **Estado Híbrido**: Soporta estado interno (no controlado) o controlado externamente  
✅ **Trigger Flexible**: El trigger puede ser un string (automáticamente envuelto en Button), un elemento React custom o ninguno  
✅ **Sincronización Automática**: El estado interno se sincroniza con el externo sin desajustes  
✅ **Confirmación de Cierre**: Opcionalmente pide confirmación (vía `window.confirm`) antes de cerrar si hay cambios  
✅ **Props de Botón**: Personaliza el botón del trigger con `triggerProps` (variant, size, etc.)

## Uso Básico

### Modal sin trigger (controlado desde el padre)

```tsx
import { useState } from 'react';
import { Modal } from '@/components/modals';
import { Button } from '@/components/ui/button';

export const MyPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Abrir Modal</Button>
            <Modal
                title="Mi Modal"
                open={open}
                onOpenChange={setOpen}
            >
                <p>Contenido aquí</p>
            </Modal>
        </>
    );
};
```

### Modal con trigger string

El string se envuelve automáticamente en un Button:

```tsx
<Modal
    title="Crear Usuario"
    trigger="Crear Usuario"
>
    <p>Formulario aquí</p>
</Modal>
```

### Modal con trigger personalizado

Pasa un elemento React custom como trigger:

```tsx
<Modal
    title="Editar Usuario"
    trigger={
        <Button variant="secondary" size="sm">
            <Pencil className="mr-2" />
            Editar
        </Button>
    }
>
    <p>Formulario aquí</p>
</Modal>
```

### Modal con props de botón

Personaliza el Button generado automáticamente:

```tsx
<Modal
    title="Crear Usuario"
    trigger="Crear Usuario"
    triggerProps={{
        variant: 'destructive',
        size: 'lg',
    }}
>
    <p>Formulario aquí</p>
</Modal>
```

### Modal con confirmación de cierre

Pide confirmación si el usuario intenta cerrar:

```tsx
<Modal
    title="Crear Usuario"
    trigger="Crear Usuario"
    shouldConfirmClose={true}
    confirmMessage="¿Deseas cerrar? Se perderán los cambios."
>
    <p>Formulario aquí</p>
</Modal>
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `title` | `string` | ✅ | Título del modal |
| `children` | `ReactNode` | ✅ | Contenido del modal |
| `trigger` | `string \| ReactNode` | ❌ | Elemento que abre el modal. Si es string, se convierte en Button |
| `triggerProps` | `IButtonProps` | ❌ | Props para el Button generado (variant, size, etc.) |
| `open` | `boolean` | ❌ | Estado controlado. Si se omite, el Modal maneja su propio estado |
| `onOpenChange` | `(open: boolean) => void` | ❌ | Callback cuando cambia el estado de apertura |
| `description` | `string` | ❌ | Descripción del modal (para accesibilidad) |
| `shouldConfirmClose` | `boolean` | ❌ | Si es true, pide confirmación antes de cerrar (default: false) |
| `confirmMessage` | `string` | ❌ | Mensaje personalizado para la confirmación |

## Ejemplos de Integración

### En UsersDialog (con estado controlado)

```tsx
export const UsersDialog = ({
    userToEdit,
    onSuccess,
    openDialog,
    setOpenDialog,
}: IUsersDialogProps) => {
    const title = userToEdit ? 'Editar usuario' : 'Crear usuario';
    const icon = userToEdit ? <Pencil className="mr-2" /> : <Plus className="mr-2" />;

    return (
        <Modal
            title={title}
            open={openDialog}
            onOpenChange={setOpenDialog}
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
```

### En UsersPage

```tsx
const [openDialog, setOpenDialog] = useState(false);

return (
    <>
        <Button onClick={() => setOpenDialog(true)}>
            <Plus />
            Crear usuario
        </Button>
        <UsersDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            // ... otras props
        />
    </>
);
```

## Sincronización de Estado

El Modal maneja automáticamente la sincronización entre estado interno y externo:

1. **Si se pasa `open` y `onOpenChange`**: El Modal actúa como componente **controlado**
2. **Si no se pasan**: El Modal usa su propio estado interno
3. **`onOpenChange` se llama en ambos casos** para notificar al padre

Esto permite que el formulario dentro del Modal llame a `onSuccess()` y cierre automáticamente sin problemas de desincronización.

## Confirmación de Cierre

Si `shouldConfirmClose` es true:

- Se muestra un `window.confirm` cuando el usuario intenta cerrar
- Si cancela, el cierre se aborta
- Si confirma, el Modal se cierra y ambos estados se actualizan

```tsx
<Modal
    title="Crear Usuario"
    trigger="Crear Usuario"
    shouldConfirmClose={true}
    confirmMessage="¿Estás seguro? Se perderán los cambios."
>
    {/* Contenido */}
</Modal>
```

## Clausura Automática desde el Formulario

El componente `DialogClose` de shadcn sigue funcionando dentro del Modal:

```tsx
import { DialogClose } from '@/components/ui/dialog';

<Modal title="Crear Usuario" open={open} onOpenChange={setOpen}>
    <form onSubmit={handleSubmit}>
        <input type="text" />
        
        <DialogClose asChild>
            <Button variant="neutral">Cancelar</Button>
        </DialogClose>
        
        <Button type="submit">Guardar</Button>
    </form>
</Modal>
```

## Notas de Accesibilidad

El Modal siempre incluye un `DialogDescription` (vacío por defecto o con el texto de la prop `description`) para cumplir con los estándares de Radix UI.

## Archivos Relacionados

- [Modal.tsx](./Modal.tsx) - Componente principal
- [Modal.examples.tsx](./Modal.examples.tsx) - Ejemplos de uso
- [@/components/ui/dialog.tsx](@/components/ui/dialog.tsx) - Dialog base de shadcn
- [@/components/ui/button.tsx](@/components/ui/button.tsx) - Button base de shadcn
