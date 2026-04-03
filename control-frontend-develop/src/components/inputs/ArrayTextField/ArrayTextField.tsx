import { useEffect, useState } from 'react';
import { FieldValues, Path, PathValue, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { TextField } from '../TextField';
import { IArrayTextFieldProps } from './types';

export const ArrayTextField = <T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    isRequired,
    maxItems,
}: IArrayTextFieldProps<T>) => {
    const values = useWatch({
        control: form.control,
        name,
    }) as string[] | undefined;

    const items = Array.isArray(values) ? values : [];
    const [ids, setIds] = useState<string[]>([]);

    // Sincronizar IDs con los items
    useEffect(() => {
        setIds((prev) => {
            if (prev.length === items.length) return prev;

            // Si hay más items que IDs (carga inicial o externa), generar nuevos
            if (items.length > prev.length) {
                const newIds = Array(items.length - prev.length)
                    .fill(null)
                    .map(() => nanoid());
                return [...prev, ...newIds];
            }

            // Si hay menos items (eliminación externa), recortar
            // Nota: Para eliminación manual usamos handleRemove para ser precisos
            return prev.slice(0, items.length);
        });
    }, [items.length]);

    const handleAdd = () => {
        const newItems = [...items, ''];
        // Actualizamos IDs optimísticamente para evitar parpadeos o desajustes
        setIds((prev) => [...prev, nanoid()]);
        form.setValue(name, newItems as unknown as PathValue<T, Path<T>>);
    };

    const handleRemove = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        // Eliminamos el ID específico para mantener la referencia correcta de los componentes
        setIds((prev) => prev.filter((_, i) => i !== index));
        form.setValue(name, newItems as unknown as PathValue<T, Path<T>>);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>

                {(!maxItems || items.length < maxItems) && (
                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleAdd}
                            className="h-8 w-8"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                {items.map((_, index) => (
                    <div
                        key={ids[index] || index}
                        className="flex gap-2 items-start"
                    >
                        <div className="flex-1">
                            <TextField
                                form={form}
                                name={`${name}[${index}]` as Path<T>}
                                label=""
                                inputOptions={{
                                    placeholder: placeholder || 'Ingrese valor',
                                }}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mt-0 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleRemove(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
