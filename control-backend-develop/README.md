# Template Users Backend

## Índice

- [Template Users Backend](#template-users-backend)
  - [Índice](#índice)
  - [Descripción General](#descripción-general)
  - [Propósito del Proyecto](#propósito-del-proyecto)
  - [Tecnologías Clave](#tecnologías-clave)
  - [Arquitectura](#arquitectura)
  - [Requisitos](#requisitos)
    - [Dependencias](#dependencias)
    - [Servicios Externos](#servicios-externos)
  - [Configuración](#configuración)
    - [Instalación](#instalación)
    - [Variables de Entorno Requeridas](#variables-de-entorno-requeridas)
  - [Ejecución](#ejecución)
    - [Desarrollo](#desarrollo)
    - [Producción](#producción)
  - [Endpoints Principales](#endpoints-principales)
    - [App Controller (`/app`)](#app-controller-app)
    - [Auth Module (`/auth`)](#auth-module-auth)
  - [Documentación API](#documentación-api)
  - [Testing](#testing)
  - [Características Adicionales](#características-adicionales)
    - [Sistema de Logs](#sistema-de-logs)
    - [Manejo de Archivos](#manejo-de-archivos)
      - [Estructura de Directorios](#estructura-de-directorios)
      - [Implementación de Carga de Archivos](#implementación-de-carga-de-archivos)
      - [Consideraciones Importantes](#consideraciones-importantes)
    - [Correos Electrónicos](#correos-electrónicos)
    - [Generación de Reportes](#generación-de-reportes)
    - [Seguridad](#seguridad)
    - [Gestión de Base de Datos y Transacciones](#gestión-de-base-de-datos-y-transacciones)
    - [Paginación, Ordenamiento y Filtrado de datos para tablas](./DataTablePagination.md)
  - [Troubleshooting Común](#troubleshooting-común)
    - [Errores de Typescript](#errores-de-typescript)
  - [Contribución](#contribución)

## Descripción General

Este proyecto es un backend robusto desarrollado con NestJS que proporciona una base sólida para la gestión de usuarios y autenticación. Incluye características como manejo de roles, autenticación JWT, envío de correos electrónicos, y un sistema de logs avanzado.

## Propósito del Proyecto

Servir como una plantilla base para aplicaciones que requieran un sistema de autenticación y gestión de usuarios, implementando las mejores prácticas de desarrollo y seguridad.

## Tecnologías Clave

- **Framework**: NestJS v10
- **Base de Datos**: PostgreSQL con TypeORM
- **Autenticación**: JWT (@nestjs/jwt)
- **Validación**: class-validator y class-transformer
- **Documentación**: Swagger
- **Logging**: Winston
- **Email**: Nodemailer
- **Testing**: Jest

## Arquitectura

El proyecto sigue una arquitectura modular basada en NestJS con los siguientes componentes principales:

- **Módulos**:
  - Auth: Gestión de autenticación y usuarios
  - Config: Configuraciones del sistema (env, database, email, etc.)
  - Logger: Sistema de logs personalizado
  - DateTime: Manejo de fechas y simulación temporal
- **Interceptores**: Transformación de respuestas
- **Guards**: Protección de rutas y operaciones
- **Pipes**: Validación de datos
- **Filters**: Manejo de excepciones

## Requisitos

### Dependencias

- Node.js (v18 o superior recomendado)
- pnpm
- PostgreSQL

### Servicios Externos

- Servidor SMTP para envío de correos
- Base de datos PostgreSQL

## Configuración

### Instalación

```bash
# Clonar el repositorio con http
git clone http://10.5.190.164/root/template-users-backend.git

# Clonar el repositorio con ssh
git clone git@10.5.190.164:root/template-users-backend.git

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env
```

### Variables de Entorno Requeridas

> La gestión, validación y documentación de variables de entorno se encuentra centralizada en el siguiente documento:
>
> **[src/config/env/README.md](./src/config/env/README.md)**
>
> Consulta ese archivo para saber cómo agregar, modificar o acceder a variables de entorno, así como ejemplos y buenas prácticas.

## Ejecución

### Desarrollo

```bash
# Modo desarrollo
npm run start:dev

# Modo debug
npm run start:debug
```

### Producción

```bash
# Construir el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

## Endpoints Principales

### App Controller (`/app`)

- `GET /` - Health check (público)
- `GET /server-date` - Obtener fecha del servidor (**modo desarrollo**)
- `POST /set-server-date` - Configurar fecha simulada (**modo desarrollo**)
- `POST /set-server-year` - Configurar año simulado (**modo desarrollo**)
- `POST /reset-server-date` - Restablecer fecha del servidor (**modo desarrollo**)
- `POST /email/examples/send-test-email` - Enviar correo de prueba
- `GET /download-excel-test` - Descargar reporte Excel de prueba
- `GET /download-pdf-test` - Descargar reporte PDF de prueba
- `GET /download-both-test?format=pdf|excel` - Selector de formato de reporte

### Auth Module (`/auth`)

- Endpoints de autenticación y gestión de usuarios
- Manejo de roles y permisos
- Registro y login de usuarios

## Documentación API

La documentación completa de la API está disponible en Swagger:

- Desarrollo: `http://127.0.0.1:3000/api`
- La documentación solo está disponible en modo desarrollo

## Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

## Características Adicionales

### Sistema de Logs

- Logs rotativos diarios
- Diferentes niveles de logging según el ambiente
- Almacenamiento en archivos y consola

### Manejo de Archivos

El proyecto incluye un sistema robusto y completo para la carga y gestión de archivos utilizando Multer. Este módulo proporciona validaciones, servicios de manipulación y ejemplos prácticos.

**Características principales:**
- Validación de tipos de archivo (extensiones permitidas)
- Validación de tamaño (límites configurables)
- Validación de cantidad (número máximo de archivos)
- Validación específica por campo (diferentes reglas para diferentes campos)
- Servicios inyectables de manipulación de archivos
- Ejemplos completos de implementación
- Manejo automático de errores y limpieza de archivos
- Soporte completo para todos los tipos de carga (FileInterceptor, FilesInterceptor, FileFieldsInterceptor)
- **Movimiento automático de archivos** con `FileMovePipe` para carpetas de concentración (ej: `documentos/`, `imagenes/`)
- **Movimiento manual de archivos** para lógica de negocio específica (ej: `usuarios/{userId}/fotos/`)

> **¿Cómo usar el módulo de carga de archivos, configurar validaciones y manejar archivos?**
>
> Consulta la guía completa y ejemplos en [`src/config/multer/README.md`](./src/config/multer/README.md)

#### Estructura de Directorios

```bash
public/
├── statics/    # Archivos estáticos (assets, imágenes por defecto)
└── dinamics/   # Archivos dinámicos (archivos cargados por los usuarios)
    └── temp/   # Archivos cargados temporalmente (ruta por defecto, se puede cambiar en .env)
    └── .../    # Directorio a donde se moverá el archivo luego de ser procesado
```

#### Ejemplos de Implementación

El módulo incluye ejemplos completos en `src/config/multer/examples/`:

- **Carga de archivo único**: Validaciones de tipo y tamaño con `FileMovePipe`
- **Carga de múltiples archivos**: Control de cantidad y validaciones con `FileMovePipe`
- **Carga con múltiples campos**: FileFieldsInterceptor con validaciones robustas y `FileMovePipe` configurado por campo
- **Carga de archivos de usuario**: Ejemplo práctico de organización por carpetas con movimiento manual (sin FileMovePipe)

#### Consideraciones Importantes

1. **Registro de Archivos Movidos**

    - Es OBLIGATORIO registrar las rutas finales de los archivos en `req.files_moved_final`
    - Esto permite al sistema limpiar los archivos en caso de error
    - Si no se registran, los archivos quedarán huérfanos en el sistema
    - El `HttpExceptionFilter` limpia automáticamente todos los tipos de archivos (temporales y finales)
    - **Importante**: Si mueves archivos manualmente desde el servicio (sin FileMovePipe), debes actualizar `req.files_moved_final` con las rutas finales

2. **Validaciones Incluidas**

    - `FileTypeValidationPipe`: Valida extensiones permitidas (soporta todos los tipos de carga)
    - `FileSizeValidationPipe`: Limita el tamaño de archivo (en MB)
    - `MaxFilesValidationPipe`: Limita el número de archivos (incluye FileFieldsInterceptor)
    - `FieldSpecificFileTypeValidationPipe`: Validación de tipos específica por campo
    - `FieldSpecificFileSizeValidationPipe`: Validación de tamaño específica por campo (límite total acumulado)
    - `FieldSpecificMaxFilesValidationPipe`: Validación de cantidad específica por campo
    - `FileMovePipe`: Movimiento automático de archivos con información completa

3. **Configuración en .env**

    ```env
    PATHS_PATH_TEMP=./temp  # Directorio temporal para archivos
    ```

### Correos Electrónicos

El proyecto utiliza Nodemailer junto con Handlebars para el envío de correos electrónicos con plantillas HTML personalizadas.

- Las plantillas HTML se encuentran en `public/statics/templates_email/`.
- El contexto (variables) de cada plantilla se define en `src/config/email/use-cases/`.
- El registro de plantillas y su tipado se gestiona en `src/config/email/email.interface.ts`.
- El servicio `EmailService` permite enviar correos usando cualquier plantilla registrada.

> **¿Cómo agregar nuevas plantillas, definir el contexto y usar el servicio?**
>
> Consulta la guía completa y ejemplos en [`src/config/email/README.md`](./src/config/email/README.md)

### Generación de Reportes

El proyecto incluye un módulo robusto para la generación de reportes en formatos Excel y PDF. Este módulo es completamente genérico y reutilizable, permitiendo generar reportes tabulares para cualquier tipo de datos.

**Características principales:**
- Generación de reportes Excel (.xlsx) y PDF
- Completamente genérico - Sin lógica específica de dominio
- Personalizable - Headers, datos, títulos y textos configurables
- Arquitectura modular con patrones Factory y Strategy

**Tablas**: El módulo está optimizado para la generación de reportes tabulares. Los datos se estructuran en formato de tabla con headers y filas de datos.

> **¿Cómo usar el módulo de reportes, configurar headers, datos y generar reportes?**
>
> Consulta la guía completa y ejemplos en [`src/config/reports/README.md`](./src/config/reports/README.md)

### Seguridad

- Protección contra ataques comunes
- Validación de datos en todas las entradas
- Encriptación de contraseñas con bcrypt
- Autenticación basada en JWT

### Gestión de Base de Datos y Transacciones

- El módulo de base de datos está documentado en detalle en [`src/config/database/README.md`](./src/config/database/README.md).
- Soporte para transacciones automáticas usando el decorador `@Transactional()` en servicios.
- No es necesario registrar entidades manualmente en el módulo de base de datos; basta con usar `TypeOrmModule.forFeature([Entidad])` en el módulo correspondiente.
- La sincronización automática de entidades está habilitada solo en desarrollo (ideal para equipos colaborativos).

## Troubleshooting Común

Ir a la carpeta `/logs/<error|info|warn|combined...>`, ubicar el error con el traceId proporcionado en el mensaje de error, caso contrario ubicar el error mas reciente.

### Errores de Typescript

```bash
# Limpiar cache y reinstalar dependencias
rm -rf node_modules
rm -rf dist
npm install
```

## Contribución

Por favor, asegúrese de seguir las guías de estilo y ejecutar los linters antes de enviar cambios:

```bash
# Formatear código
npm run format

# Ejecutar linter
npm run lint
```

Siempre realizar un `git pull` antes de realizar cualquier cambio, la rama objetivo es `develop`.
