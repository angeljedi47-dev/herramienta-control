import { IPaginationQuery } from './interfaces/dataTableInterface';
import { IActionOfTable } from './interfaces/dataTableInterface';
import { Button } from '@/components/ui/button';

interface IProps<T> {
    pagination: IPaginationQuery;
    data: T[];
    actions: IActionOfTable<T>[];
}

export const DataTableActions = <T,>({
    pagination,
    data,
    actions,
}: IProps<T>) => {
    return (
        <div className="flex items-center gap-2">
            {actions.map((action, index) => (
                <Button
                    key={index}
                    size="sm"
                    onClick={() => action.onClick?.({ pagination, data: data })}
                    disabled={action.disabled}
                    className="flex items-center gap-2 h-10"
                >
                    {action.icon}
                    {action.label}
                </Button>
            ))}
        </div>
    );
};
