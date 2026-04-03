import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export interface IAction<T> {
    label: string;
    onClick: (data?: T) => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    disabledFn?: (data?: T) => boolean;
}

interface IActionMenuProps<T> {
    actions: IAction<T>[];
    data: T;
}

export const ActionMenu = <T,>({ actions, data }: IActionMenuProps<T>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions
                    .filter((action) => {
                        // Verificar si la acción está deshabilitada
                        const isDisabled =
                            action.disabled ||
                            (action.disabledFn
                                ? action.disabledFn(data)
                                : false);
                        return !isDisabled; // Solo mostrar acciones que no están deshabilitadas
                    })
                    .map((action, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(data)}
                            className="cursor-pointer"
                        >
                            {action.icon && (
                                <span className="mr-2 h-4 w-4">
                                    {action.icon}
                                </span>
                            )}
                            {action.label}
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
