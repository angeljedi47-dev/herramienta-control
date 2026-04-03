import { ChevronsUpDown, Loader2, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { FieldValues } from 'react-hook-form';
import { IComboboxProps } from './types';
import { useCombobox } from './useCombobox';
import { ComboboxItem, SelectedTags } from './ComboboxParts';
import { AxiosError } from 'axios';

export const Combobox = <T extends FieldValues, TData = unknown>({
    form,
    name,
    label,
    placeholder = 'Seleccionar...',
    description,
    isRequired,
    propertiesMapped,
    isMulti = false,
    isSearchable = true,
    isDisabled = false,
    onOpenChange,
    containerClassName,
    mode = 'form',
    rightElement,
    searchFn,
    queryKey,
    debounceMs,
    showAddButton = false,
    addButtonText = 'Agregar',
    onAddClick,
    getElementSelected,
    getElementDeselected,
    isItemDisabled,
}: IComboboxProps<T, TData>) => {
    const error = form.formState.errors[name];
    const value = form.watch(name);

    const {
        open,
        handleOpenChange,
        getSelectedLabels,
        handleSelect,
        getOptionLabel,
        getOptionValue,
        handleSearch,
        isLoading,
        searchTerm,
        options,
        error: comboboxError,
        searchInputRef,
        getIsItemDisabled,
    } = useCombobox({
        propertiesMapped,
        isMulti,
        onOpenChange,
        searchFn,
        queryKey,
        debounceMs,
        value,
        getElementSelected,
        getElementDeselected,
        isItemDisabled,
    });

    const renderSelectedValue = (
        value: string | number | (string | number)[],
    ) => {
        const selectedLabels = getSelectedLabels(value);

        if (isMulti && Array.isArray(selectedLabels)) {
            return selectedLabels.length > 0 ? (
                <SelectedTags
                    options={options}
                    values={selectedLabels}
                    getOptionLabel={getOptionLabel}
                    getOptionValue={getOptionValue}
                />
            ) : (
                placeholder
            );
        }

        return selectedLabels || placeholder;
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={containerClassName}>
                    {mode === 'form' ? (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <FormLabel
                                htmlFor={name}
                                className="flex items-center gap-1"
                            >
                                {label}
                                {isRequired && (
                                    <span className="text-destructive">*</span>
                                )}
                            </FormLabel>
                            {description && (
                                <span className="text-sm text-muted-foreground sm:text-right">
                                    {description}
                                </span>
                            )}
                        </div>
                    ) : (
                        <FormLabel
                            htmlFor={name}
                            className="flex items-center gap-1"
                        >
                            {label}
                            {isRequired && (
                                <span className="text-destructive">*</span>
                            )}
                        </FormLabel>
                    )}
                    <div
                        className={
                            mode === 'filter' ? 'flex gap-2 items-center' : ''
                        }
                    >
                        <FormControl className="flex-1">
                            <Popover
                                open={open}
                                onOpenChange={handleOpenChange}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            'w-full justify-between',
                                            !!error && 'border-destructive',
                                            isDisabled &&
                                                'opacity-50 cursor-not-allowed',
                                        )}
                                        disabled={isDisabled}
                                    >
                                        {renderSelectedValue(field.value)}
                                        {isLoading ? (
                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="start">
                                    <Command>
                                        {isSearchable && (
                                            <CommandInput
                                                ref={searchInputRef}
                                                placeholder={`Buscar ${label.toLowerCase()}...`}
                                                value={searchTerm}
                                                onValueChange={handleSearch}
                                            />
                                        )}
                                        <CommandList>
                                            {isLoading && (
                                                <div className="p-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>
                                                        Cargando opciones...
                                                    </span>
                                                </div>
                                            )}
                                            {comboboxError && (
                                                <div className="p-4 text-sm text-destructive flex items-center justify-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>
                                                        {comboboxError instanceof
                                                        AxiosError
                                                            ? comboboxError
                                                                  .response
                                                                  ?.data.message
                                                            : 'Error al cargar las opciones. Intente nuevamente.'}
                                                    </span>
                                                </div>
                                            )}
                                            {!isLoading && !comboboxError && (
                                                <>
                                                    <CommandEmpty>
                                                        <div className="flex flex-col items-center gap-2 py-4">
                                                            <span>
                                                                No se
                                                                encontraron
                                                                opciones.
                                                            </span>
                                                            {showAddButton &&
                                                                onAddClick && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={
                                                                            onAddClick
                                                                        }
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                        {
                                                                            addButtonText
                                                                        }
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {options.map(
                                                            (option) => {
                                                                const isItemDisabledValue =
                                                                    getIsItemDisabled(
                                                                        option,
                                                                    );
                                                                return (
                                                                    <CommandItem
                                                                        key={getOptionValue(
                                                                            option,
                                                                        )}
                                                                        value={getOptionLabel(
                                                                            option,
                                                                        )}
                                                                        onSelect={(
                                                                            currentValue,
                                                                        ) =>
                                                                            handleSelect(
                                                                                currentValue,
                                                                                field.onChange,
                                                                                field.value,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isItemDisabledValue
                                                                        }
                                                                    >
                                                                        <ComboboxItem
                                                                            option={
                                                                                option
                                                                            }
                                                                            isSelected={
                                                                                isMulti
                                                                                    ? Array.isArray(
                                                                                          field.value,
                                                                                      ) &&
                                                                                      field.value.includes(
                                                                                          getOptionValue(
                                                                                              option,
                                                                                          ),
                                                                                      )
                                                                                    : field.value ===
                                                                                      getOptionValue(
                                                                                          option,
                                                                                      )
                                                                            }
                                                                            getOptionLabel={
                                                                                getOptionLabel
                                                                            }
                                                                            isDisabled={
                                                                                isItemDisabledValue
                                                                            }
                                                                        />
                                                                    </CommandItem>
                                                                );
                                                            },
                                                        )}
                                                    </CommandGroup>
                                                </>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormControl>
                        {mode === 'filter' && rightElement}
                    </div>
                    <div className="flex-1 min-h-[20px] mt-1.5">
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
};
