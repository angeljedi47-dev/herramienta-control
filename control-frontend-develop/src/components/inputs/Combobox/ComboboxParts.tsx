import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ISelectedTagsProps<TData> {
    options: TData[];
    values: (string | number)[];
    getOptionLabel: (option: TData) => string;
    getOptionValue: (option: TData) => string | number;
}

export const SelectedTags = <TData,>({
    options,
    values,
    getOptionLabel,
    getOptionValue,
}: ISelectedTagsProps<TData>) => {
    return (
        <div className="flex gap-2 justify-start flex-wrap">
            {values.map((val, i) => {
                const option = options.find(
                    (opt) => getOptionValue(opt) === val,
                );
                return option ? (
                    <div
                        key={i}
                        className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                    >
                        {getOptionLabel(option)}
                    </div>
                ) : null;
            })}
        </div>
    );
};

interface IComboboxItemProps<TData> {
    option: TData;
    isSelected: boolean;
    getOptionLabel: (option: TData) => string;
    isDisabled?: boolean;
}

export const ComboboxItem = <TData,>({
    option,
    isSelected,
    getOptionLabel,
    isDisabled = false,
}: IComboboxItemProps<TData>) => {
    return (
        <div
            className={cn(
                'flex items-center',
                isDisabled && 'cursor-not-allowed',
            )}
            role="option"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
        >
            <Check
                className={cn(
                    'mr-2 h-4 w-4',
                    isSelected ? 'opacity-100' : 'opacity-0',
                )}
            />
            {getOptionLabel(option)}
        </div>
    );
};
