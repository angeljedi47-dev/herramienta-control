import { SetMetadata } from '@nestjs/common';

export const REQUIRED_OPERATIONS_KEY = 'requiredOperations';

export type OperationRequirement = {
    anyOf?: number[]; // Al menos una de estas operaciones
    allOf?: number[]; // Todas estas operaciones son requeridas
};

export const RequireOperations = (requirement: OperationRequirement) =>
    SetMetadata(REQUIRED_OPERATIONS_KEY, requirement);
