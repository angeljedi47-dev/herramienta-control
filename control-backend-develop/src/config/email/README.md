# Gestión de Plantillas de Correo Electrónico

Esta guía explica cómo agregar nuevas plantillas de correo electrónico al sistema, cómo definir el HTML usando Handlebars, cómo definir el contexto (interface) y cómo usar el servicio de envío de correos.

---

## 1. Crear la plantilla HTML

Las plantillas HTML se encuentran en:

```
public/statics/templates_email/
```

Ejemplo de plantilla:

```html
<!-- public/statics/templates_email/test-email.html -->
<div>
    <h1>Hola {{nombre_sistema}}</h1>
    <p>Fecha y hora: {{fecha_hora}}</p>
</div>
```

- Usa la sintaxis de Handlebars: `{{variable}}` para variables dinámicas.
- El nombre del archivo debe coincidir con la clave que usarás en el sistema (ejemplo: `test-email`).

---

## 2. Definir el contexto de la plantilla

Cada plantilla debe tener una interface que defina las variables que usará el HTML. Estas interfaces se ubican en:

```
src/config/email/examples/use-cases/
```

Ejemplo:

```typescript
// src/config/email/examples/use-cases/test-email.context.ts
export interface ITestEmailContext {
    nombre_sistema: string;
    fecha_hora: string;
}
```

---

## 3. Registrar la plantilla en el sistema

El registro de plantillas se realiza en:

```
src/config/email/email.interface.ts
```

Importa la interface y agrégala al `TemplateMap`:

```typescript
import { ITestEmailContext } from './use-cases/test-email.context';

export type TemplateMap = {
    'test-email': ITestEmailContext;
    // Agrega aquí más plantillas
};
```

---

## 4. Usar el servicio de correo

Para enviar un correo, usa el `EmailService` y pasa el nombre de la plantilla y el contexto correspondiente. Ejemplo:

```typescript
await this.emailService.sendEmail({
    to: 'destinatario@correo.com',
    subject: 'Correo de prueba',
    template: 'test-email',
    context: {
        nombre_sistema: 'Mi Sistema',
        fecha_hora: new Date().toLocaleString(),
    },
});
```

- El contexto debe coincidir exactamente con la interface registrada para la plantilla.
- El sistema validará el tipo en tiempo de compilación.

---

## 5. Buenas prácticas

- Usa nombres descriptivos y en inglés para las interfaces y archivos.
- Mantén cada contexto en un archivo separado dentro de `use-cases/`.
- El nombre de la plantilla debe coincidir entre el archivo HTML y la clave en `TemplateMap`.
- Documenta las variables requeridas en la interface si es necesario.

---

## 6. Ejemplo completo

### 1. Plantilla HTML

`public/statics/templates_email/welcome-email.html`

```html
<div>
    <h2>Welcome, {{userName}}!</h2>
    <p>Access your account <a href="{{welcomeLink}}">here</a>.</p>
</div>
```

### 2. Contexto

`src/config/email/examples/use-cases/welcome-email.context.ts`

```typescript
export interface IWelcomeEmailContext {
    userName: string;
    welcomeLink: string;
}
```

### 3. Registro

En `email.interface.ts`:

```typescript
import { IWelcomeEmailContext } from './use-cases/welcome-email.context';

export type TemplateMap = {
    'test-email': ITestEmailContext;
    'welcome-email': IWelcomeEmailContext;
};
```

### 4. Uso

```typescript
await this.emailService.sendEmail({
    to: 'user@correo.com',
    subject: 'Welcome!',
    template: 'welcome-email',
    context: {
        userName: 'John Doe',
        welcomeLink: 'https://app.com/login',
    },
});
```

---

## 7. Ejemplos y Endpoints de Prueba

El módulo incluye ejemplos completos y endpoints de prueba para demostrar su funcionamiento:

### Estructura de Ejemplos

```
src/config/email/examples/
├── controllers/
│   └── email-examples.controller.ts
├── services/
│   └── email-examples.service.ts
└── use-cases/
    └── test-email.context.ts
```

### Endpoints de Ejemplos

- `POST /email/examples/send-test-email` - Envía un correo de prueba usando la plantilla `test-email`

### Uso de los Ejemplos

Los ejemplos están disponibles en Swagger bajo la sección "Email - Ejemplos" y demuestran:

- Cómo configurar un controlador para envío de correos
- Cómo usar el EmailService con plantillas
- Cómo estructurar los contextos de las plantillas
- Cómo integrar con otros servicios (EnvsService, DateTimeService)

### Plantilla de Ejemplo

La plantilla `test-email` incluye:
- Logo institucional
- Información del sistema
- Fecha y hora actual
- Estructura HTML básica con Handlebars

Consulta el código de los ejemplos para ver implementaciones completas y reutilizables. 