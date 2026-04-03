import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground border-2 border-primary',
                secondary:
                    'bg-secondary-foreground text-secondary hover:bg-secondary hover:text-secondary-foreground border-2 border-secondary',
                neutral:
                    'bg-neutral-foreground text-neutral hover:bg-neutral hover:text-neutral-foreground border-2 border-neutral',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border border-input bg-card hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-blue-700 underline-offset-4 hover:underline',
            },
            size: {
                default: 'px-[25px] py-[10px] h-fit',
                lg: 'px-[100px] py-[20px] text-lg h-fit',
                sm: 'px-[10px] py-[5px] text-sm h-fit',
                xs: 'px-[5px] py-[1px] text-sm h-fit',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
