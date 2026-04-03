interface ISensitiveFieldConfig {
    paths: string[];
    replacement?: string;
}

const SENSITIVE_FIELDS: ISensitiveFieldConfig = {
    paths: [
        'password',
        'contraseña',
        'token',
        'secret',
        'authorization',
        'current_password',
        'new_password',
        'credit_card',
        'tarjeta',
        'cvv',
        'pin',
        'access_token',
        'refresh_token',
        'jwt',
    ],
    replacement: '[DATOS CONFIDENCIALES]',
};

export function sanitizeData(data: any): any {
    if (!data) return data;

    if (typeof data !== 'object') return data;

    if (Array.isArray(data)) {
        return data.map((item) => sanitizeData(item));
    }

    const sanitized = { ...data };

    for (const key in sanitized) {
        // Convertir la clave a minúsculas para comparación insensible a mayúsculas/minúsculas
        const lowerKey = key.toLowerCase();

        // Verificar si el campo actual contiene alguna palabra sensible
        const isSensitive = SENSITIVE_FIELDS.paths.some((field) =>
            lowerKey.includes(field),
        );

        if (isSensitive) {
            sanitized[key] = SENSITIVE_FIELDS.replacement;
        } else if (typeof sanitized[key] === 'object') {
            sanitized[key] = sanitizeData(sanitized[key]);
        }
    }

    return sanitized;
}

export function sanitizeHeaders(
    headers: Record<string, any>,
): Record<string, any> {
    const sensitiveHeaders = [
        'authorization',
        'cookie',
        'x-api-key',
        'x-auth-token',
    ];

    return Object.entries(headers).reduce(
        (acc, [key, value]) => {
            const lowerKey = key.toLowerCase();
            acc[key] = sensitiveHeaders.includes(lowerKey)
                ? '[DATOS CONFIDENCIALES]'
                : value;
            return acc;
        },
        {} as Record<string, any>,
    );
}
