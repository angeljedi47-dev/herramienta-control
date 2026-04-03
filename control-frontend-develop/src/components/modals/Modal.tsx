import React, { ReactNode, useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, IButtonProps } from '@/components/ui/button';

interface IModalProps {
    /** Contenido del trigger. Si es string, se envuelve en un Button. Si es ReactNode, se usa como está. */
    trigger?: string | ReactNode;
    /** Props para aplicar al Button generado cuando trigger es un string */
    triggerProps?: Omit<IButtonProps, 'children'>;
    /** Título del modal */
    title: string;
    /** Descripción del modal (opcional, para accesibilidad) */
    description?: string;
    /** Contenido del modal */
    children: ReactNode;
    /** Estado controlado: si está abierto desde fuera */
    open?: boolean;
    /** Callback cuando cambia el estado de apertura */
    onOpenChange?: (open: boolean) => void;
    /** Si es true, pide confirmación antes de cerrar con window.confirm */
    shouldConfirmClose?: boolean;
    /** Mensaje de confirmación personalizado */
    confirmMessage?: string;
}

/**
 * Componente Modal reutilizable y flexible
 *
 * Características:
 * - Estado interno o controlado externamente
 * - Trigger personalizable (string como botón o cualquier elemento React)
 * - Confirmación de cierre opcional con window.confirm
 * - Sincronización automática entre estado interno y externo
 */
export const Modal = React.forwardRef<HTMLDivElement, IModalProps>(
    (
        {
            trigger,
            triggerProps,
            title,
            description,
            children,
            open: externalOpen,
            onOpenChange,
            shouldConfirmClose = false,
            confirmMessage = '¿Estás seguro de que deseas cerrar? Los cambios no guardados se perderán.',
        },
        ref,
    ) => {
        const [internalOpen, setInternalOpen] = useState(false);

        // Sincronizar estado externo con interno
        useEffect(() => {
            if (externalOpen !== undefined) {
                setInternalOpen(externalOpen);
            }
        }, [externalOpen]);

        // Determinar cuál estado usar
        const isControlled = externalOpen !== undefined;
        const isOpen = isControlled ? externalOpen : internalOpen;

        // Manejador unificado de cambios de apertura
        const handleOpenChange = (newOpen: boolean) => {
            // Si se intenta cerrar y shouldConfirmClose está activo
            if (!newOpen && isOpen && shouldConfirmClose) {
                const confirmed = window.confirm(confirmMessage);
                if (!confirmed) {
                    return; // Abortar cierre
                }
            }

            // Actualizar estado
            if (isControlled) {
                onOpenChange?.(newOpen);
            } else {
                setInternalOpen(newOpen);
            }

            // Notificar al padre en ambos casos
            onOpenChange?.(newOpen);
        };

        // Procesar el trigger
        const triggerContent = trigger ? (
            typeof trigger === 'string' ? (
                <Button {...triggerProps}>{trigger}</Button>
            ) : (
                trigger
            )
        ) : null;

        return (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                {triggerContent && (
                    <DialogTrigger asChild>{triggerContent}</DialogTrigger>
                )}
                <DialogContent ref={ref}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                        {!description && <DialogDescription />}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        );
    },
);

Modal.displayName = 'Modal';
