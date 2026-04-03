import { useForm } from 'react-hook-form';
import { TextField } from '../inputs/TextField';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { IDataTableGoToPageProps } from './interfaces';
import { GoToPageFormValues, goToPageSchema } from './schema';

export function DataTableGoToPage({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}: IDataTableGoToPageProps) {
    const form = useForm<GoToPageFormValues>({
        resolver: zodResolver(goToPageSchema),
        defaultValues: {
            page: '',
        },
    });

    const onSubmit = (values: GoToPageFormValues) => {
        const pageNumber = parseInt(values.page);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
            form.reset();
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-1"
            >
                <TextField
                    form={form}
                    name="page"
                    label=""
                    inputOptions={{
                        placeholder: currentPage.toString(),
                        numeric: true,
                        min: 1,
                        max: totalPages,
                        'aria-label': 'Ir a página específica',
                    }}
                    mode="filter"
                    rightElement={
                        <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            disabled={!form.formState.isValid || isLoading}
                            className="whitespace-nowrap"
                        >
                            Ir
                        </Button>
                    }
                />
            </form>
        </Form>
    );
}
