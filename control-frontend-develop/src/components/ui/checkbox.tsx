import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
    const [state, setState] = React.useState<
        'unchecked' | 'checked' | 'indeterminate'
    >(
        props.checked === 'indeterminate'
            ? 'indeterminate'
            : props.checked
              ? 'checked'
              : 'unchecked',
    );

    React.useEffect(() => {
        if (props.checked === 'indeterminate') {
            setState('indeterminate');
        } else if (props.checked) {
            setState('checked');
        } else {
            setState('unchecked');
        }
    }, [props.checked]);

    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-muted data-[state=indeterminate]:text-muted-foreground data-[state=indeterminate]:border-muted-foreground/50',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn('flex items-center justify-center text-current')}
            >
                {state === 'indeterminate' ? (
                    <Minus className="h-4 w-4" />
                ) : (
                    <Check className="h-4 w-4" />
                )}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
