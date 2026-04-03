import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { IDataTablePageSizeProps } from './interfaces';

export function DataTablePageSize({
    value,
    options,
    onChange,
}: IDataTablePageSizeProps) {
    return (
        <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-gray-500">Registros por página:</span>
            <Select value={String(value)} onValueChange={onChange}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
