import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface IInputWithIconsProps extends React.ComponentProps<'input'> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    hasError?: boolean;
    errorClassName?: string;
    numeric?: boolean;
    min?: number;
    max?: number;
}

export const InputWithIcons = forwardRef<
    HTMLInputElement,
    IInputWithIconsProps
>(
    (
        {
            leftIcon,
            rightIcon,
            className,
            hasError,
            errorClassName,
            numeric,
            min,
            max,
            onChange,
            ...props
        },
        ref,
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (numeric) {
                const newValue = e.target.value;
                // Solo permitir números
                if (!/^\d*$/.test(newValue)) return;

                // Validar min y max si se proporcionan
                if (newValue !== '') {
                    const numValue = parseInt(newValue);
                    if (min !== undefined && numValue < min) return;
                    if (max !== undefined && numValue > max) return;
                }
            }

            onChange?.(e);
        };

        return (
            <div className="relative w-full">
                {leftIcon && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {leftIcon}
                    </div>
                )}
                <Input
                    {...props}
                    ref={ref}
                    onChange={handleChange}
                    className={cn(
                        className,
                        leftIcon && 'pl-8',
                        rightIcon && 'pr-8',
                        hasError && (errorClassName || 'border-destructive'),
                    )}
                    type={numeric ? 'text' : props.type}
                    inputMode={numeric ? 'numeric' : props.inputMode}
                    pattern={numeric ? '[0-9]*' : props.pattern}
                />
                {rightIcon && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {rightIcon}
                    </div>
                )}
            </div>
        );
    },
);

InputWithIcons.displayName = 'InputWithIcons';
