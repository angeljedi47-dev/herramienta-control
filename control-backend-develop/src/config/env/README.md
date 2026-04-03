# Gestión de Variables de Entorno en el Backend

Este proyecto utiliza un módulo centralizado para la gestión y validación de variables de entorno, ubicado en `@/config/env`. **Todas las variables de entorno y sus grupos deben ser definidos únicamente en el schema**. No es necesario modificar ningún otro archivo para agregar, quitar o modificar variables o grupos.

---

## ¿Cómo funciona?

- El archivo principal es [`src/config/env/schemas/envs.schema.ts`](./schemas/envs.schema.ts).
- Aquí se definen todos los grupos y variables de entorno usando [Zod](https://zod.dev/), lo que permite validación automática y tipado.
- El resto del sistema (servicios, controladores, etc.) accede a las variables a través del servicio `EnvsService`, que ya está configurado para usar este schema.

---

## ¿Cómo agregar un nuevo grupo o variable?

1. **Abre** el archivo [`envs.schema.ts`](./schemas/envs.schema.ts).
2. **Agrega** el nuevo grupo o variable dentro del objeto `envsSchema` siguiendo la estructura existente.
3. **(Opcional)** Si necesitas tipos, usa `EnvVars` que se genera automáticamente a partir del schema.

### Ejemplo: Agregar un grupo y una variable

Supón que quieres agregar un grupo `REDIS` con la variable `REDIS_URL`:

```ts
export const envsSchema = z.object({
  // ... grupos existentes ...
  REDIS: z.object({
    REDIS_URL: z.string(),
  }),
});
```

Luego, en tu archivo `.env`:

```
REDIS_REDIS_URL=redis://localhost:6379
```

¡Listo! No necesitas modificar ningún otro archivo.

---

## ¿Cómo acceder a las variables?

Utiliza el servicio `EnvsService` en cualquier parte de tu aplicación.

### Acceder a una variable específica

```ts
constructor(private envsService: EnvsService) {}

const redisUrl = this.envsService.getVar('REDIS', 'REDIS_URL');
```

### Acceder a todas las variables de un grupo

```ts
const dbConfig = this.envsService.getGroup('DB');
// dbConfig = { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME }

const port = dbConfig.DB_PORT;
```

Esto es útil para pasar la configuración completa a módulos externos (por ejemplo, TypeORM, Nodemailer, etc.).

---

## Validación automática

- Si falta una variable o no cumple con el tipo definido, la aplicación lanzará un error detallado al iniciar.
- Puedes usar transformaciones y enums para validar formatos, valores permitidos, etc.

---

## Buenas prácticas

- **No modifiques** otros archivos para agregar variables de entorno.
- **Agrupa** las variables por dominio funcional (DB, EMAIL, SERVER, etc.).
- **Usa enums** para valores restringidos (por ejemplo, ambientes).
- **Documenta** cada grupo y variable en el schema si es necesario.

---

## Resumen

- **Solo modifica** `envs.schema.ts` para gestionar variables de entorno.
- El sistema se encarga de la validación, tipado y acceso.
- Cualquier cambio se refleja automáticamente en toda la aplicación.

---

¿Dudas? Consulta este archivo o revisa el schema para ver ejemplos y detalles. 