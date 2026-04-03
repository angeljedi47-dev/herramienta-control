import { z } from 'zod';

export const createUserSchema = z
    .object({
        idUsuario: z.number().optional(),
        nombreUsuario: z
            .string({ message: 'El nombre de usuario es requerido' })
            .min(3, {
                message:
                    'El nombre de usuario debe tener al menos 3 caracteres',
            })
            .max(30, {
                message:
                    'El nombre de usuario debe tener menos de 30 caracteres',
            }),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),

        roles: z
            .array(z.number())
            .min(1, { message: 'Se debe seleccionar al menos un rol' }),
    })
    .superRefine((data, ctx) => {
        if (data.password) {
            if (data.password.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                    path: ['password'],
                });
            }
        }
        if (!data.idUsuario) {
            if (!data.password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'La contraseña es requerida',
                    path: ['password'],
                });
            }
        }
        if (data.password && data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Las contraseñas no coinciden',
                path: ['confirmPassword'],
            });
        }
    });

export type ICreateUserSchema = z.infer<typeof createUserSchema>;
