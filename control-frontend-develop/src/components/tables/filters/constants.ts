import { IOperatorOption } from './types';
import {
    Equal,
    ArrowLeftRight,
    Search,
    Ban,
    CircleDot,
    XCircle,
    List,
} from 'lucide-react';

export const DATE_OPERATORS = ['$eq', '$gte', '$lte', '$btw'] as const;

/**
 * Constante que define los operadores disponibles para los filtros
 * Para añadir un nuevo operador:
 * 1. Agregar un nuevo objeto al array
 * 2. Definir label, value, symbol y description
 * 3. Asegurarse que el value coincida con el backend
 */
export const OPERATOR_OPTIONS: IOperatorOption[] = [
    {
        label: 'Igual a',
        value: '$eq',
        symbol: Equal,
        className: 'h-4 w-4',
        description: 'Busca valores exactamente iguales',
        supportedTypes: ['text', 'number', 'select', 'date'],
    },
    {
        label: 'Mayor que',
        value: '$gt',
        symbol: '>',
        className: 'text-sm font-bold',
        description: 'Busca valores mayores al especificado',
        supportedTypes: ['number', 'date'],
    },
    {
        label: 'Mayor o igual que',
        value: '$gte',
        symbol: '≥',
        className: 'text-sm font-bold',
        description: 'Busca valores mayores o iguales al especificado',
        supportedTypes: ['number', 'date'],
    },
    {
        label: 'Menor que',
        value: '$lt',
        symbol: '<',
        className: 'text-sm font-bold',
        description: 'Busca valores menores al especificado',
        supportedTypes: ['number', 'date'],
    },
    {
        label: 'Menor o igual que',
        value: '$lte',
        symbol: '≤',
        className: 'text-sm font-bold',
        description: 'Busca valores menores o iguales al especificado',
        supportedTypes: ['number', 'date'],
    },
    {
        label: 'Entre',
        value: '$btw',
        symbol: ArrowLeftRight,
        className: 'h-4 w-4',
        description: 'Busca valores entre dos valores (incluidos)',
        supportedTypes: ['number', 'date'],
    },
    {
        label: 'Contiene',
        value: '$ilike',
        symbol: Search,
        className: 'h-4 w-4',
        description: 'Busca texto que contenga el valor especificado',
        supportedTypes: ['text'],
    },
    {
        label: 'Empieza con',
        value: '$sw',
        symbol: '→',
        className: 'text-sm font-bold',
        description: 'Busca texto que empiece con el valor especificado',
        supportedTypes: ['text'],
    },
    {
        label: 'Es nulo',
        value: '$null',
        symbol: Ban,
        className: 'h-4 w-4',
        description: 'Busca valores nulos o vacíos',
        supportedTypes: ['text', 'number', 'select', 'date'],
    },
    {
        label: 'Contiene (array)',
        value: '$contains',
        symbol: CircleDot,
        className: 'h-4 w-4',
        description: 'Busca arrays que contengan el valor especificado',
        supportedTypes: ['text'],
    },
    {
        label: 'No contiene',
        value: '$not',
        symbol: XCircle,
        className: 'h-4 w-4',
        description: 'Busca valores que no contengan el texto especificado',
        supportedTypes: ['text'],
    },
    {
        label: 'En',
        value: '$in',
        symbol: List,
        className: 'h-4 w-4',
        description:
            'Busca valores que coincidan con una lista (separar por comas)',
        supportedTypes: ['text', 'number', 'select', 'date'],
    },
] as const;
