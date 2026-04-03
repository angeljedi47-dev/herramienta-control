/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from 'zod';
import { IFilterField } from '../interfaces';

/**
 * Crea un esquema base según el tipo de campo
 */
const createBaseSchema = (field: IFilterField): z.ZodType => {
    switch (field.type) {
        case 'multiselect':
            return z.array(z.union([z.string(), z.number()])).default([]);
        case 'select':
            return z.union([z.string(), z.number()]).optional();
        case 'date':
            return z.union([z.string(), z.date()]).optional();
        case 'number':
            return z
                .string()
                .transform((val) => (val ? Number(val) : ''))
                .optional();
        case 'checkbox':
            return z.union([z.boolean(), z.string(), z.null()]).optional();
        default:
            return z.string().optional();
    }
};

/**
 * Crea una estructura anidada de objetos para el esquema
 */
const createNestedStructure = (
    path: string[],
    schema: z.ZodType,
    currentLevel: Record<string, any> = {},
): Record<string, any> => {
    if (path.length === 1) {
        currentLevel[path[0]] = schema;
        return currentLevel;
    }

    const [current, ...rest] = path;
    currentLevel[current] = currentLevel[current] || {};

    // Recursivamente construir la estructura anidada
    createNestedStructure(rest, schema, currentLevel[current]);

    return currentLevel;
};

/**
 * Convierte una estructura anidada en un esquema Zod
 */
const convertToZodSchema = (
    structure: Record<string, any>,
): z.ZodObject<any> => {
    const schema: Record<string, z.ZodType> = {};

    Object.entries(structure).forEach(([key, value]) => {
        if (value instanceof z.ZodType) {
            schema[key] = value;
        } else if (typeof value === 'object' && value !== null) {
            schema[key] = convertToZodSchema(value).optional();
        }
    });

    return z.object(schema);
};

/**
 * Crea el esquema de validación Zod para los filtros
 * @param fields - Array de campos a filtrar
 * @returns Esquema Zod para validación de formulario
 */
export const createFilterSchema = (fields: IFilterField[]) => {
    const shape: Record<string, z.ZodType> = {};
    const nestedStructure: Record<string, any> = {};

    fields.forEach((field) => {
        const fieldPath = field.name.split('.');
        const baseSchema = createBaseSchema(field);

        // Mantener el campo plano para compatibilidad
        shape[field.name] = baseSchema;

        // Agregar esquema para el operador
        shape[`${field.name}_operator`] = z.string();

        // Si es un campo de fecha, agregar el campo _end con el mismo esquema
        if (field.type === 'date') {
            shape[`${field.name}_end`] = baseSchema;
        }

        // Crear estructura anidada si el campo tiene puntos
        if (fieldPath.length > 1) {
            const nestedFields = createNestedStructure(fieldPath, baseSchema);
            // Combinar con la estructura existente
            Object.entries(nestedFields).forEach(([key, value]) => {
                nestedStructure[key] = {
                    ...(nestedStructure[key] || {}),
                    ...value,
                };
            });
        }
    });

    // Convertir la estructura anidada a esquema Zod y combinar con los campos planos
    const nestedSchema = convertToZodSchema(nestedStructure);
    const finalShape = {
        ...shape,
        ...nestedSchema.shape,
    };

    return z.object(finalShape);
};
