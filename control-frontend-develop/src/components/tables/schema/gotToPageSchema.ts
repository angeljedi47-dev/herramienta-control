import { z } from 'zod';

export const goToPageSchema = z.object({
    page: z
        .string()
        .min(1, 'Requerido')
        .refine((val) => !isNaN(parseInt(val)), {
            message: 'Debe ser un número',
        }),
});

export type GoToPageFormValues = z.infer<typeof goToPageSchema>;
