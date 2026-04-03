import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { OPERATOR_OPTIONS } from './constants';
import { IFilterField } from '../interfaces';

interface IOperatorSelectorProps {
    field: IFilterField;
    form: ReturnType<typeof useForm>;
    operators: typeof OPERATOR_OPTIONS;
}

/**
 * Componente que renderiza el selector de operadores para cada campo
 * Muestra un popover con los operadores disponibles según el tipo de campo
 */
export const OperatorSelector = ({
    field,
    form,
    operators,
}: IOperatorSelectorProps) => {
    const currentOperator = form.watch(`${field.name}_operator`);
    const availableOperators = operators.filter((op) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field.operators.includes(op.value as any),
    );
    const selectedOp =
        availableOperators.find((op) => op.value === currentOperator) ||
        availableOperators[0];

    const renderSymbol = (symbol: string | LucideIcon, className?: string) => {
        if (typeof symbol === 'string') {
            return <span className={className}>{symbol}</span>;
        }
        const IconComponent = symbol;
        return <IconComponent className={className} />;
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-10 h-10"
                    type="button"
                    title={selectedOp?.label}
                >
                    {selectedOp
                        ? renderSymbol(selectedOp.symbol, selectedOp.className)
                        : renderSymbol(
                              availableOperators[0].symbol,
                              availableOperators[0].className,
                          )}
                    <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col flex-wrap gap-1">
                    {availableOperators.map((op) => (
                        <Button
                            key={op.value}
                            variant={
                                currentOperator === op.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className="h-8 px-2 justify-start gap-2 flex-1"
                            title={op.description}
                            type="button"
                            onClick={() =>
                                form.setValue(
                                    `${field.name}_operator`,
                                    op.value,
                                )
                            }
                        >
                            {renderSymbol(op.symbol, op.className)}
                            <span className="text-xs">{op.label}</span>
                            {op.description && (
                                <HelpCircle className="h-3 w-3 ml-auto text-muted-foreground" />
                            )}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
