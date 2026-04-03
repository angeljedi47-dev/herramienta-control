import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { IComboboxOption, IPropertiesMapped, SearchFn } from './types';
import { useDebounce } from '@/hooks/debounce';

interface IUseComboboxProps<TData> {
    propertiesMapped?: IPropertiesMapped<TData>;
    isMulti: boolean;
    onOpenChange?: (open: boolean) => void;
    searchFn?: SearchFn<TData>;
    queryKey?: QueryKey;
    debounceMs?: number;
    value?: string | number | (string | number)[];
    getElementSelected?: (element: TData) => void;
    getElementDeselected?: (element: TData) => void;
    isItemDisabled?: (element: TData) => boolean;
}

export const useCombobox = <TData>({
    propertiesMapped,
    isMulti,
    onOpenChange,
    searchFn,
    queryKey = ['COMBOBOX_SEARCH_DEFAULT'],
    debounceMs = 300,
    value,
    getElementSelected,
    getElementDeselected,
    isItemDisabled,
}: IUseComboboxProps<TData>) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<TData[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const {
        data: searchResults,
        isLoading,
        error,
    } = useQuery({
        queryKey: [...queryKey, debouncedSearchTerm],
        queryFn: async () => {
            if (!searchFn) return { data: [] };
            const result = await searchFn(debouncedSearchTerm);
            if (!result || !result.data) {
                throw new Error('Invalid response format from search function');
            }
            return result;
        },
        enabled: !!searchFn && open,
        initialData: { data: [] },
        retry: false,
    });
    const getOptionValue = (
        option: TData | IComboboxOption,
    ): string | number => {
        if (propertiesMapped) {
            if (typeof option === 'string' || typeof option === 'number') {
                return option;
            }
            const value = (option as TData)[propertiesMapped.value];
            return typeof value === 'number' ? value : String(value);
        }
        return (option as IComboboxOption).value;
    };

    // Mantener las opciones seleccionadas actualizadas basado en el valor actual
    useEffect(() => {
        const updateSelectedOptions = async () => {
            if (!value || !searchFn) return;

            const values = Array.isArray(value) ? value : [value];
            const currentSelectedValues = selectedOptions.map((opt) =>
                getOptionValue(opt),
            );

            // Solo buscar valores que realmente faltan
            const missingValues = values.filter(
                (v) => !currentSelectedValues.includes(v),
            );

            if (missingValues.length > 0) {
                const results = await searchFn('');
                const newOptions = results.data.filter((opt) =>
                    missingValues.includes(getOptionValue(opt)),
                );

                if (newOptions.length > 0) {
                    // Asegurarse de no duplicar opciones
                    setSelectedOptions((prev) => {
                        const uniqueOptions = new Map();
                        [...prev, ...newOptions].forEach((opt) => {
                            uniqueOptions.set(getOptionValue(opt), opt);
                        });
                        return Array.from(uniqueOptions.values());
                    });
                }
            }
        };

        updateSelectedOptions();
    }, [value, searchFn]);

    // Generar lista de opciones únicas
    const options = useMemo(() => {
        const uniqueOptions = new Map<string | number, TData>();

        // Primero agregar las opciones seleccionadas
        selectedOptions.forEach((opt) => {
            uniqueOptions.set(getOptionValue(opt), opt);
        });

        // Si hay error, solo mostrar las opciones seleccionadas
        if (error) {
            return Array.from(uniqueOptions.values());
        }

        // Luego agregar resultados de búsqueda que no estén ya incluidos
        if (searchResults?.data) {
            searchResults.data.forEach((opt) => {
                const value = getOptionValue(opt);
                if (!uniqueOptions.has(value)) {
                    uniqueOptions.set(value, opt);
                }
            });
        }

        return Array.from(uniqueOptions.values());
    }, [selectedOptions, searchResults?.data, error]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen && searchFn) {
            setSearchTerm('');
        }
        onOpenChange?.(newOpen);
    };

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const getOptionLabel = (option: TData | IComboboxOption): string => {
        if (propertiesMapped) {
            if (typeof option === 'string' || typeof option === 'number') {
                const foundOption = options.find(
                    (opt) => String(getOptionValue(opt)) === String(option),
                );
                if (foundOption) {
                    if (typeof propertiesMapped.label === 'function') {
                        const result = propertiesMapped.label(
                            foundOption as TData,
                        );
                        return result || '';
                    }
                    const labelValue = (foundOption as TData)[
                        propertiesMapped.label
                    ];
                    return labelValue ? String(labelValue).trim() : '';
                }
                return String(option);
            }

            if (typeof propertiesMapped.label === 'function') {
                const result = propertiesMapped.label(option as TData);
                return result || '';
            }
            const labelValue = (option as TData)[propertiesMapped.label];
            return labelValue ? String(labelValue).trim() : '';
        }
        const label = (option as IComboboxOption).label;
        return label ? String(label).trim() : '';
    };

    const getIsItemDisabled = (option: TData): boolean => {
        return isItemDisabled ? isItemDisabled(option) : false;
    };

    const findOptionByValue = (value: string | number) => {
        return options.find(
            (opt) => String(getOptionValue(opt)) === String(value),
        );
    };

    const findOptionByLabel = (label: string) => {
        if (!label) return undefined;

        const normalizedSearchLabel = label
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        return options.find((opt) => {
            const optionLabel = getOptionLabel(opt);
            if (!optionLabel) return false;

            const normalizedOptionLabel = optionLabel
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            return normalizedOptionLabel === normalizedSearchLabel;
        });
    };

    const getSelectedLabels = (
        value: string | number | (string | number)[],
    ) => {
        if (isMulti && Array.isArray(value)) {
            if (value.length === 0) return null;
            const processedValues = value.map((v) =>
                typeof v === 'object' && v !== null
                    ? getOptionValue(v as TData)
                    : v,
            );
            return processedValues;
        }

        const processedValue =
            typeof value === 'object' && value !== null
                ? getOptionValue(value as TData)
                : value;
        const option = findOptionByValue(processedValue as string | number);
        return option ? getOptionLabel(option) : null;
    };

    const handleSelect = (
        currentValue: string,
        onChange: (value: string | number | (string | number)[]) => void,
        value: string | number | (string | number)[],
    ) => {
        const selectedOption = findOptionByLabel(currentValue);
        if (!selectedOption) return;

        // Prevenir selección si el elemento está deshabilitado
        if (getIsItemDisabled(selectedOption)) return;

        const optionValue = getOptionValue(selectedOption);

        if (isMulti && Array.isArray(value)) {
            const processedValues = value.map((v) =>
                typeof v === 'object' && v !== null
                    ? getOptionValue(v as TData)
                    : v,
            );

            if (processedValues.includes(optionValue)) {
                // Si ya está seleccionado, lo removemos tanto del valor como del estado
                const newValue = processedValues.filter(
                    (val) => val !== optionValue,
                );
                setSelectedOptions((prev) =>
                    prev.filter((opt) => getOptionValue(opt) !== optionValue),
                );
                onChange(newValue);

                // Llamar al callback con el elemento completo deseleccionado
                getElementDeselected?.(selectedOption);
            } else {
                // Si no está seleccionado, lo agregamos tanto al valor como al estado
                const newValue = [...processedValues, optionValue];
                setSelectedOptions((prev) => [...prev, selectedOption]);
                onChange(newValue);

                // Llamar al callback con el elemento completo seleccionado
                getElementSelected?.(selectedOption);
            }

            if (searchTerm) {
                setSearchTerm('');
                searchInputRef.current?.focus();
            }
        } else {
            onChange(optionValue);
            handleOpenChange(false);

            // Llamar al callback con el elemento completo seleccionado
            getElementSelected?.(selectedOption);
            setSearchTerm('');
            searchInputRef.current?.focus();
        }
    };

    return {
        open,
        handleOpenChange,
        getSelectedLabels,
        handleSelect,
        getOptionLabel,
        getOptionValue,
        handleSearch,
        searchInputRef,
        isLoading,
        searchTerm,
        options,
        error,
        getIsItemDisabled,
    };
};
