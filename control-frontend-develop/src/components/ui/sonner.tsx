import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                    closeButton:
                        '!group-[.toast]:text-neutral-foreground !bg-neutral right-[-3px] left-auto top-3 !border-none hover:!border-1 hover:!border-black',
                    success:
                        '!text-green-600 !border-l-green-600 !border-l-4 text-sm',
                    error: '!text-destructive !border-l-destructive !border-l-4 text-sm',
                    warning:
                        '!text-yellow-600 !border-l-yellow-600 !border-l-4 text-sm',
                },
                closeButton: true,
            }}
            position="bottom-center"
            {...props}
        />
    );
};

export { Toaster };
