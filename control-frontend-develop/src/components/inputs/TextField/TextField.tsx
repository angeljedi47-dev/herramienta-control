import React from 'react';
import { FieldValues } from 'react-hook-form';
import {
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
    FormControl,
} from '../../ui/form';
import { CharacterCounter } from './CharacterCounter';
import { InputWithIcons } from './InputWithIcons';
import { ITextFieldProps } from './types';
import { HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../ui/tooltip';
import { Textarea } from '../../ui/textarea';
import { cn } from '@/lib/utils';

export const TextField = <T extends FieldValues>({
    form,
    name,
    label,
    inputOptions,
    description,
    isRequired,
    showCharCounter,
    mode = 'form',
    tooltip,
    rightElement,
}: ITextFieldProps<T>) => {
    const error = form.formState.errors[name];
    const {
        containerClassName,
        minLength,
        maxLength,
        type,
        rows,
        ...restInputProps
    } = inputOptions || {};

    const currentValue = form.watch(name);
    const currentLength = currentValue?.length || 0;

    const renderLabel = () => (
        <div className="flex items-center gap-1">
            <FormLabel htmlFor={name} className="flex items-center gap-1">
                {label}
                {isRequired && <span className="text-red-500">*</span>}
            </FormLabel>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={containerClassName}>
                    {mode === 'form' ? (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            {renderLabel()}
                            {description && (
                                <span className="text-sm text-muted-foreground sm:text-right">
                                    {description}
                                </span>
                            )}
                        </div>
                    ) : (
                        renderLabel()
                    )}
                    <div
                        className={
                            mode === 'filter' ? 'flex gap-2 items-center' : ''
                        }
                    >
                        <FormControl className="flex-1">
                            {type === 'textarea' ? (
                                <Textarea
                                    {...field}
                                    {...(restInputProps as unknown as React.ComponentProps<'textarea'>)}
                                    rows={rows}
                                    className={cn(
                                        'w-full',
                                        !!error && 'border-destructive',
                                        inputOptions?.className,
                                    )}
                                    id={name}
                                    aria-invalid={!!error}
                                    aria-required={isRequired}
                                    minLength={minLength}
                                    maxLength={maxLength}
                                />
                            ) : (
                                <InputWithIcons
                                    {...field}
                                    {...restInputProps}
                                    type={type}
                                    className="w-full"
                                    id={name}
                                    aria-invalid={!!error}
                                    aria-required={isRequired}
                                    hasError={!!error}
                                    minLength={minLength}
                                    maxLength={maxLength}
                                />
                            )}
                        </FormControl>
                        {mode === 'filter' && rightElement}
                    </div>
                    <div className="flex flex-col-reverse gap-1 sm:flex-row sm:justify-between sm:items-start mt-1.5">
                        <div className="flex-1">
                            <FormMessage />
                        </div>
                        {showCharCounter && (minLength || maxLength) && (
                            <CharacterCounter
                                currentLength={currentLength}
                                minLength={minLength}
                                maxLength={maxLength}
                            />
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
};
