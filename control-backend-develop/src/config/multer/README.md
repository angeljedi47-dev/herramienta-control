# Módulo de Carga de Archivos (Multer)

Este módulo proporciona una solución robusta y completa para la carga y gestión de archivos en NestJS, utilizando Multer como middleware base. Incluye validaciones, servicios de manipulación de archivos y ejemplos prácticos.

## Características Principales

- **Validación de tipos de archivo**: Control de extensiones permitidas por campo
- **Validación de tamaño**: Límites configurables por archivo y por campo
- **Validación de cantidad**: Control del número máximo de archivos por campo
- **Validación específica por campo**: Diferentes reglas para diferentes campos de archivo
- **Servicios de manipulación**: Métodos inyectables para mover, verificar y eliminar archivos
- **Ejemplos completos**: Casos de uso reales implementados
- **Manejo automático de errores**: Limpieza automática de archivos en caso de fallo
- **Mensajes de error personalizados**: Información específica del campo que falló
- **Validaciones automáticas**: Los pipes validan automáticamente propiedades básicas del archivo
- **Movimiento automático**: Pipe para mover archivos de temp a destino final automáticamente

## Estructura del Módulo

```
src/config/multer/
├── README.md                           # Esta documentación
├── multer.module.ts                    # Configuración del módulo
├── file-upload.interface.ts            # Tipos de archivos permitidos
├── index.ts                            # Exportaciones principales
├── pipes/                              # Pipes de validación
│   ├── index.ts                        # Exportaciones de pipes
│   ├── file-type.validation.pipe.ts    # Validación de tipos
│   ├── max-file-size.pipe.ts           # Validación de tamaño
│   ├── max-files.validation.pipe.ts    # Validación de cantidad
│   ├── field-specific-file-type.validation.pipe.ts    # Validación de tipos por campo
│   ├── field-specific-file-size.validation.pipe.ts    # Validación de tamaño por campo
│   ├── field-specific-max-files.validation.pipe.ts    # Validación de cantidad por campo
│   └── file-move.pipe.ts                               # Movimiento automático de archivos
├── services/                           # Servicios del módulo
│   ├── index.ts                        # Exportaciones de servicios
│   └── file-manipulation.service.ts    # Servicio de manipulación de archivos
├── utils/                              # Utilidades
│   ├── index.ts                        # Exportaciones de utilidades
│   └── file-size.util.ts               # Utilidades de tamaño
└── examples/                           # Ejemplos de implementación
    ├── controllers/
    │   └── file-upload-examples.controller.ts
    ├── services/
    │   └── file-upload-examples.service.ts
    ├── dtos/
    │   └── file-upload.dtos.ts         # DTOs de ejemplo
    └── interfaces/
        └── file-upload.interfaces.ts   # Interfaces de ejemplo
```

## Configuración

### 1. Importar el Módulo

```typescript
// En tu app.module.ts
import { MulterModuleApp } from './config/multer/multer.module';

@Module({
  imports: [
    MulterModuleApp.register(),
    // ... otros módulos
  ],
})
export class AppModule {}
```

### 2. Variables de Entorno

Asegúrate de tener configurada la variable `PATH_TEMP` en tu archivo `.env`:

```env
PATH_TEMP=./temp
```

## Pipes de Validación

### Pipes Básicos (Para todos los tipos de carga)

#### FileTypeValidationPipe

Valida que los archivos tengan las extensiones permitidas. Soporta todos los tipos de carga de archivos:

```typescript
import { FileTypeValidationPipe } from 'src/config/multer/pipes';

// Single file
@UploadedFile(
  new FileTypeValidationPipe(['.pdf', '.doc', '.docx', '.jpg', '.png'])
)
file: Express.Multer.File

// Multiple files
@UploadedFiles(
  new FileTypeValidationPipe(['.pdf', '.doc', '.docx', '.jpg', '.png'])
)
files: Express.Multer.File[]

// Multiple fields
@UploadedFiles(
  new FileTypeValidationPipe(['.jpg', '.jpeg', '.png'])
)
files: { imagenes?: Express.Multer.File[]; foto?: Express.Multer.File[] }
```

**Tipos por defecto**: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.jpg`, `.jpeg`, `.png`

#### FileSizeValidationPipe

Valida el tamaño máximo de los archivos (en MB). Soporta todos los tipos de carga de archivos:

```typescript
import { FileSizeValidationPipe } from 'src/config/multer/pipes';

// Single file
@UploadedFile(
  new FileSizeValidationPipe(5) // 5MB máximo
)
file: Express.Multer.File

// Multiple files
@UploadedFiles(
  new FileSizeValidationPipe(2) // 2MB máximo por archivo
)
files: Express.Multer.File[]

// Multiple fields
@UploadedFiles(
  new FileSizeValidationPipe(2) // 2MB máximo por archivo
)
files: { imagenes?: Express.Multer.File[]; foto?: Express.Multer.File[] }
```

#### MaxFilesValidationPipe

Valida el número máximo de archivos permitidos. Soporta todos los tipos de carga de archivos:

```typescript
import { MaxFilesValidationPipe } from 'src/config/multer/pipes';

// Multiple files
@UploadedFiles(
  new MaxFilesValidationPipe(10) // Máximo 10 archivos
)
files: Express.Multer.File[]

// Multiple fields
@UploadedFiles(
  new MaxFilesValidationPipe(5) // Máximo 5 archivos total
)
files: { imagenes?: Express.Multer.File[]; foto?: Express.Multer.File[] }
```

### Pipes Específicos por Campo (Para FileFieldsInterceptor)

Los siguientes pipes permiten definir diferentes reglas de validación para cada campo cuando se usa `FileFieldsInterceptor`. Son la **recomendación principal** para casos complejos con múltiples campos.

#### FieldSpecificFileTypeValidationPipe

Permite definir diferentes tipos de archivo permitidos para cada campo cuando se usa `FileFieldsInterceptor`:

```typescript
import { FieldSpecificFileTypeValidationPipe } from 'src/config/multer/pipes';

// Configuración de tipos por campo
const fieldTypeConfig = {
    imagenes: ['.jpg', '.jpeg', '.png'], // Solo imágenes para 'imagenes'
    documentos: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'], // Solo documentos para 'documentos'
    foto: ['.jpg', '.jpeg', '.png'], // Solo imágenes para 'foto'
    default: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'], // Tipos por defecto
};

@UploadedFiles(
    new FieldSpecificFileTypeValidationPipe(fieldTypeConfig)
)
files: { imagenes?: Express.Multer.File[]; documentos?: Express.Multer.File[]; foto?: Express.Multer.File[] }
```

#### FieldSpecificFileSizeValidationPipe

Permite definir diferentes tamaños máximos **acumulados** para cada campo cuando se usa `FileFieldsInterceptor`. **Valida el tamaño total de todos los archivos en el campo**:

```typescript
import { FieldSpecificFileSizeValidationPipe } from 'src/config/multer/pipes';

// Configuración de tamaños por campo (en MB) - LÍMITE TOTAL ACUMULADO
const fieldSizeConfig = {
    imagenes: 5, // 5MB máximo TOTAL para todas las imágenes del campo
    documentos: 10, // 10MB máximo TOTAL para todos los documentos del campo
    foto: 2, // 2MB máximo TOTAL para todas las fotos del campo
    default: 5, // 5MB por defecto
};

@UploadedFiles(
    new FieldSpecificFileSizeValidationPipe(fieldSizeConfig)
)
files: { imagenes?: Express.Multer.File[]; documentos?: Express.Multer.File[]; foto?: Express.Multer.File[] }
```

**Comportamiento:**
- ✅ **Valida el tamaño total acumulado** de todos los archivos en el campo
- ✅ **Si excede el límite, rechaza TODOS los archivos** del campo
- ✅ **Mensaje claro** indicando qué archivos causaron el problema
- ✅ **No se guarda ningún archivo** si se excede el límite total

#### FieldSpecificMaxFilesValidationPipe

Permite definir diferentes cantidades máximas de archivos para cada campo cuando se usa `FileFieldsInterceptor`. Es una **alternativa mejorada** al `maxCount` de Multer:

```typescript
import { FieldSpecificMaxFilesValidationPipe } from 'src/config/multer/pipes';

// Configuración de cantidad máxima por campo
const fieldMaxFilesConfig = {
    imagenes: 3, // Máximo 3 imágenes
    documentos: 1, // Máximo 1 documento
    fotos: 5, // Máximo 5 fotos
    default: 1, // 1 archivo por defecto
};

// ✅ NO usar maxCount en FileFieldsInterceptor
@UseInterceptors(FileFieldsInterceptor([
    { name: 'imagenes' },     // Sin maxCount
    { name: 'documentos' },   // Sin maxCount
]))

@UploadedFiles(
    new FieldSpecificMaxFilesValidationPipe(fieldMaxFilesConfig)
)
files: { imagenes?: Express.Multer.File[]; documentos?: Express.Multer.File[]; fotos?: Express.Multer.File[] }
```

**Ventajas sobre `maxCount` de FileFieldsInterceptor:**
- ✅ **Mensajes de error personalizados** en lugar de "Unexpected field"
- ✅ **Información específica** del campo que excedió el límite
- ✅ **Integración completa** con el sistema de errores `BaseException`
- ✅ **Mayor control** sobre la validación
- ✅ **Consistencia** con otros pipes de validación

#### FileMovePipe

Mueve automáticamente los archivos de temp a destino final y retorna objetos completos con toda la información del archivo. **Reduce drásticamente el código repetitivo** en los servicios. **Configurable por campo** para especificar carpetas de destino específicas:

```typescript
import { FileMovePipe, IMovedFileInfo } from 'src/config/multer/pipes';

// Single file - Retorna objeto con toda la información del archivo
@UploadedFile(
    new FileTypeValidationPipe(['.pdf', '.doc', '.docx']),
    new FileSizeValidationPipe(5),
    new FileMovePipe('documents'), // ← Carpeta específica
)
movedFile: IMovedFileInfo // ← Recibe objeto completo con toda la información

// Multiple files - Retorna array de objetos con información completa
@UploadedFiles(
    new FileTypeValidationPipe(['.pdf', '.doc', '.docx']),
    new FileSizeValidationPipe(2),
    new FileMovePipe('documents'), // ← Carpeta específica
)
movedFiles: IMovedFileInfo[] // ← Recibe array de objetos con información completa

// Multiple fields - Retorna objeto con información completa por campo
@UploadedFiles(
    new FieldSpecificFileTypeValidationPipe({...}),
    new FieldSpecificFileSizeValidationPipe({...}),
    new FieldSpecificMaxFilesValidationPipe({...}),
    new FileMovePipe({ // ← Configuración por campo
        imagenes: 'images/profile',
        documentos: 'documents/legal',
        default: 'files_test',
    }),
)
movedFiles: { // ← Recibe información completa organizada por campo
    imagenes?: IMovedFileInfo[];
    documentos?: IMovedFileInfo[];
}
```

**Estructura de `IMovedFileInfo`:**

```typescript
interface IMovedFileInfo {
    originalname: string;    // Nombre original del archivo
    filename: string;        // Nombre generado por Multer
    finalPath: string;       // Ruta final donde se movió el archivo
    size: number;           // Tamaño en bytes
    mimetype: string;       // Tipo MIME del archivo
    encoding: string;       // Encoding del archivo
    fieldname?: string;     // Nombre del campo (para FileFieldsInterceptor)
}
```

**Opciones de Configuración:**

```typescript
// 1. Sin configuración (usa 'files_test' por defecto)
new FileMovePipe()

// 2. Carpeta específica para todos los archivos
new FileMovePipe('documents')

// 3. Configuración por campo (para FileFieldsInterceptor)
new FileMovePipe({
    imagenes: 'images/profile',
    documentos: 'documents/legal',
    default: 'files_test', // Carpeta por defecto para campos no configurados
})
```

**Ventajas:**
- ✅ **Información completa**: Acceso a `originalname`, `size`, `mimetype`, etc.
- ✅ **Código mínimo**: Solo lógica de negocio en el servicio
- ✅ **Sin validaciones repetitivas**: No necesitas validar `filename` ni mover manualmente
- ✅ **Automático**: `req.files_moved_final` se actualiza automáticamente
- ✅ **Flexible**: Funciona con todos los tipos de carga de archivos
- ✅ **Configurable**: Especifica carpetas de destino por campo
- ✅ **Consistente**: Mismo comportamiento en toda la aplicación


## Servicios de Manipulación

### FileManipulationService

Proporciona métodos inyectables para manipular archivos de forma segura:

```typescript
import { FileManipulationService } from 'src/config/multer/services';

// En tu servicio
constructor(
  private readonly fileManipulationService: FileManipulationService,
) {}

// Verificar si un archivo existe en temp
const exists = this.fileManipulationService.validateExistFileOnTemp(filename);

// Mover archivo de temp a destino final
const finalPath = this.fileManipulationService.moveFileOfTempToFinalDest(
  filename,
  'mi-carpeta',
);

// Eliminar archivo de temp
const deleted = this.fileManipulationService.deleteFileFromTemp(filename);

// Eliminar archivo del directorio final
const deletedFinal = this.fileManipulationService.deleteFileFromFinal(filePath);

// Obtener ruta del directorio temporal
const tempPath = this.fileManipulationService.getTempPath();

// Obtener ruta del directorio dinámico
const dynamicPath = this.fileManipulationService.getDynamicPath('mi-carpeta');
```

### FileSizeUtil

Utilidades para el manejo de tamaños de archivo:

```typescript
import { FileSizeUtil } from 'src/config/multer/utils/file-size.util';

// Formatear tamaño de archivo
const formattedSize = FileSizeUtil.formatFileSize(1024 * 1024); // "1.00 MB"

// Convertir bytes a unidad específica
const sizeInMB = FileSizeUtil.convertBytes(1024 * 1024, 'MB'); // 1
```

## Casos de Uso Implementados

### 1. Carga de Archivo Único

```typescript
@Post('single-file')
@UseInterceptors(FileInterceptor('file'))
async uploadSingleFile(
  @Body() dto: SingleFileUploadDto,
  @UploadedFile(
    new FileTypeValidationPipe(['.pdf', '.doc', '.docx', '.jpg', '.png']),
    new FileSizeValidationPipe(5), // 5MB máximo
    new FileMovePipe('files_test'), // ← Mueve automáticamente
  )
  movedFile: IMovedFileInfo, // ← Recibe objeto completo con toda la información
  @Req() req: IReqCustom,
) {
  const result = await this.service.processSingleFile(dto, movedFile, req);
  return { message: 'Archivo subido correctamente', data: result };
}
```

### 2. Carga de Múltiples Archivos

```typescript
@Post('multiple-files')
@UseInterceptors(FilesInterceptor('files'))
async uploadMultipleFiles(
  @Body() dto: MultipleFilesUploadDto,
  @UploadedFiles(
    new FileTypeValidationPipe(['.pdf', '.doc', '.docx', '.jpg', '.png']),
    new FileSizeValidationPipe(2), // 2MB máximo por archivo
    new MaxFilesValidationPipe(5), // Máximo 5 archivos
    new FileMovePipe('files_test'), // ← Mueve automáticamente
  )
  movedFiles: IMovedFileInfo[], // ← Recibe array de objetos con información completa
  @Req() req: IReqCustom,
) {
  const result = await this.service.processMultipleFiles(dto, movedFiles, req);
  return { message: 'Archivos subidos correctamente', data: result };
}
```



### 4. Carga con Validación Específica por Campo

```typescript
@Post('field-specific-validation')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'imagenes' }, // Sin maxCount, se valida con pipe
    { name: 'documentos' }, // Sin maxCount, se valida con pipe
  ]),
)
async uploadWithFieldSpecificValidation(
  @Body() dto: MultipleFieldsUploadDto,
  @UploadedFiles(
    // Validación de tipos específica por campo
    new FieldSpecificFileTypeValidationPipe({
      imagenes: ['.jpg', '.jpeg', '.png'], // Solo imágenes para 'imagenes'
      documentos: ['.pdf'], // Solo pdf para 'documentos'
    }),
    // Validación de tamaño específica por campo (LÍMITE TOTAL ACUMULADO)
    new FieldSpecificFileSizeValidationPipe({
      imagenes: 2, // 2MB máximo TOTAL para todas las imágenes
      documentos: 2, // 2MB máximo TOTAL para todos los documentos
    }),
    // Validación de cantidad de archivos específica por campo
    new FieldSpecificMaxFilesValidationPipe({
      imagenes: 3, // Máximo 3 imágenes
      documentos: 2, // Máximo 2 documentos
    }),
    // Movimiento automático con configuración por campo
    new FileMovePipe({
      imagenes: 'files_test/imagenes',
      documentos: 'files_test/documentos',
    }),
  )
  movedFiles: { // ← Información completa organizada por campo
    imagenes?: IMovedFileInfo[];
    documentos?: IMovedFileInfo[];
  },
  @Req() req: IReqCustom,
) {
  const result = await this.service.processFieldSpecificFiles(dto, movedFiles, req);
  return { 
    message: 'Archivos subidos correctamente con validación específica por campo', 
    data: result 
  };
}
```

**Este es el caso de uso más completo** para aplicaciones que manejan múltiples tipos de archivos con diferentes reglas de validación.

### 5. Movimiento de Archivos - Dos Aproximaciones

#### **Aproximación 1: Con FileMovePipe (Para carpetas de concentración)**

**Cuándo usar:** Cuando quieres mover archivos a carpetas generales como `documentos/`, `imagenes/`, `usuarios/`, etc.

```typescript
@Post('upload-to-general-folder')
@UseInterceptors(FileInterceptor('file'))
async uploadToGeneralFolder(
  @Body() dto: { name: string },
  @UploadedFile(
    new FileTypeValidationPipe(['.pdf', '.doc', '.docx']),
    new FileSizeValidationPipe(5),
    new FileMovePipe('documentos'), // ← Mueve a carpeta general
  )
  movedFile: IMovedFileInfo, // ← Recibe información completa
  @Req() req: IReqCustom,
) {
  // El archivo ya está en documentos/ y req.files_moved_final está actualizado
  return { message: 'Archivo subido correctamente', data: movedFile };
}
```

#### **Aproximación 2: Sin FileMovePipe (Para lógica de negocio específica)**

**Cuándo usar:** Cuando necesitas mover archivos a carpetas específicas basadas en lógica de negocio como `usuarios/{userId}/fotos/`, `proyectos/{projectId}/documentos/`, etc.

```typescript
@Post('user-files')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'fotos' },
    { name: 'documentos' },
  ]),
)
async uploadUserFiles(
  @Body() dto: UserProfileUploadDto,
  @UploadedFiles(
    // ✅ Solo validaciones, NO FileMovePipe
    new FieldSpecificFileTypeValidationPipe({
      fotos: ['.jpg', '.jpeg', '.png'],
      documentos: ['.pdf', '.doc', '.docx'],
    }),
    new FieldSpecificFileSizeValidationPipe({
      fotos: 5, // 5MB TOTAL para todas las fotos
      documentos: 10, // 10MB TOTAL para todos los documentos
    }),
    new FieldSpecificMaxFilesValidationPipe({
      fotos: 3, // Máximo 3 fotos
      documentos: 2, // Máximo 2 documentos
    }),
  )
  files: { // ← Archivos originales de Multer (sin FileMovePipe)
    fotos?: Express.Multer.File[];
    documentos?: Express.Multer.File[];
  },
  @Req() req: IReqCustom,
) {
  const result = await this.service.processUserFiles(dto, files, req);
  return { message: 'Archivos del usuario subidos correctamente', data: result };
}

// En el servicio:
async processUserFiles(dto: UserProfileUploadDto, files: { fotos?: Express.Multer.File[]; documentos?: Express.Multer.File[] }, req: IReqCustom) {
  const result: IUserProfileResult = {
    id: this.generateId(),
    userId: dto.userId,
    name: dto.name,
    description: dto.description,
    uploadedAt: new Date(),
  };

  // ✅ Mover directamente desde temp a carpeta específica
  if (files.fotos && files.fotos.length > 0) {
    const processedFotos: IFieldSpecificFileResult[] = [];

    for (const file of files.fotos) {
      const userFotosDir = `usuarios/${dto.userId}/fotos`;
      const finalUserPath = this.fileManipulationService.moveFileOfTempToFinalDest(
        file.filename, // Desde temp
        userFotosDir,  // A usuarios/{userId}/fotos/
      );

      // ✅ Actualizar req.files_moved_final
      if (!req.files_moved_final) {
        req.files_moved_final = [];
      }
      req.files_moved_final.push(finalUserPath);

      processedFotos.push({
        originalName: file.originalname,
        finalPath: finalUserPath,
        size: file.size,
      });
    }

    result.fotos = processedFotos;
  }

  // ✅ Mismo proceso para documentos
  if (files.documentos && files.documentos.length > 0) {
    const processedDocumentos: IFieldSpecificFileResult[] = [];

    for (const file of files.documentos) {
      const userDocsDir = `usuarios/${dto.userId}/documentos`;
      const finalUserPath = this.fileManipulationService.moveFileOfTempToFinalDest(
        file.filename, // Desde temp
        userDocsDir,   // A usuarios/{userId}/documentos/
      );

      // ✅ Actualizar req.files_moved_final
      if (!req.files_moved_final) {
        req.files_moved_final = [];
      }
      req.files_moved_final.push(finalUserPath);

      processedDocumentos.push({
        originalName: file.originalname,
        finalPath: finalUserPath,
        size: file.size,
      });
    }

    result.documentos = processedDocumentos;
  }

  return result;
}
```

#### **¿Cuándo usar cada aproximación?**

| Caso de Uso | FileMovePipe | Sin FileMovePipe |
|-------------|-------------|------------------|
| **Carpetas generales** | ✅ `documentos/`, `imagenes/`, `usuarios/` | ❌ |
| **Carpetas específicas** | ❌ | ✅ `usuarios/{userId}/fotos/` |
| **Lógica de negocio** | ❌ | ✅ `proyectos/{projectId}/documentos/` |
| **Organización por ID** | ❌ | ✅ `clientes/{clientId}/contratos/` |

#### **Ventajas de cada aproximación:**

**Con FileMovePipe:**
- ✅ Código más simple
- ✅ req.files_moved_final se actualiza automáticamente
- ✅ Información completa del archivo disponible
- ✅ Ideal para carpetas de concentración

**Sin FileMovePipe:**
- ✅ Control total sobre la ubicación final
- ✅ No hay movimiento innecesario de archivos
- ✅ Más eficiente para lógica de negocio específica
- ✅ Estructura de carpetas personalizada

**DTO del ejemplo:**
```typescript
export class UserProfileUploadDto {
  @ApiProperty({
    description: 'ID del usuario (será usado como nombre de carpeta)',
    example: 'user_12345',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Fotos del usuario (serán movidas a usuarios/{userId}/fotos/)',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  fotos?: Express.Multer.File[];

  @ApiProperty({
    description: 'Documentos del usuario (serán movidos a usuarios/{userId}/documentos/)',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  documentos?: Express.Multer.File[];
}
```

**Comportamiento:**
1. ✅ **FileMovePipe** mueve archivos a `usuarios/`
2. ✅ **Servicio** mueve fotos a `usuarios/{userId}/fotos/`
3. ✅ **Servicio** mueve documentos a `usuarios/{userId}/documentos/`
4. ✅ **req.files_moved_final** se actualiza con todas las rutas finales
5. ✅ **Swagger** muestra el campo `userId` para especificar la carpeta destino
6. ✅ **Estructura final**: `usuarios/user_12345/fotos/` y `usuarios/user_12345/documentos/`



## Manejo en el Servicio

### Patrón de Uso

```typescript
async processSingleFile(dto: SingleFileUploadDto, movedFile: IMovedFileInfo, _req: IReqCustom) {
  // ✅ El FileMovePipe ya movió el archivo y actualizó req.files_moved_final
  // ✅ Ahora tenemos toda la información del archivo

  // Crear resultado (simulando guardado en BD)
  const result: ISingleFileResult = {
    id: this.generateId(),
    name: dto.name,
    description: dto.description,
    originalName: movedFile.originalname,
    finalPath: movedFile.finalPath,
    size: movedFile.size,
    uploadedAt: new Date(),
  };

  return result;
}
```

### Movimiento Adicional de Archivos

En algunos casos, necesitas mover el archivo a una ubicación específica basada en la lógica de negocio (por ejemplo, `fotos/<id_usuario>/`). El `FileMovePipe` mueve el archivo a una ubicación inicial, pero puedes moverlo nuevamente desde el servicio:

```typescript
async processUserProfile(dto: UserProfileDto, movedFile: IMovedFileInfo, req: IReqCustom) {
  // 1. El FileMovePipe ya movió el archivo a 'fotos/'
  // 2. Ahora necesitamos moverlo a 'fotos/<id_usuario>/'
  
  const userId = dto.userId;
  const userPhotoDir = `fotos/${userId}`;
  
  // Mover archivo a la carpeta específica del usuario
  const finalUserPath = this.fileManipulationService.moveFileOfTempToFinalDest(
    movedFile.filename, // Usar el filename del archivo movido
    userPhotoDir,
  );
  
  // ⚠️ IMPORTANTE: Actualizar req.files_moved_final con la nueva ruta
  if (!req.files_moved_final) {
    req.files_moved_final = [];
  }
  
  // Remover la ruta anterior y agregar la nueva
  const index = req.files_moved_final.indexOf(movedFile.finalPath);
  if (index > -1) {
    req.files_moved_final.splice(index, 1);
  }
  req.files_moved_final.push(finalUserPath);
  
  // Crear resultado con la nueva ruta
  const result: IUserProfileResult = {
    id: userId,
    name: dto.name,
    photoPath: finalUserPath,
    originalName: movedFile.originalname,
    size: movedFile.size,
    uploadedAt: new Date(),
  };
  
  return result;
}
```

**Ejemplo con múltiples archivos:**

```typescript
async processUserDocuments(dto: UserDocumentsDto, movedFiles: IMovedFileInfo[], req: IReqCustom) {
  const userId = dto.userId;
  const userDocsDir = `documentos/${userId}`;
  const finalPaths: string[] = [];
  
  for (const movedFile of movedFiles) {
    // Mover cada archivo a la carpeta específica del usuario
    const finalUserPath = this.fileManipulationService.moveFileOfTempToFinalDest(
      movedFile.filename,
      userDocsDir,
    );
    
    finalPaths.push(finalUserPath);
    
    // Actualizar req.files_moved_final
    if (!req.files_moved_final) {
      req.files_moved_final = [];
    }
    
    // Remover ruta anterior y agregar nueva
    const index = req.files_moved_final.indexOf(movedFile.finalPath);
    if (index > -1) {
      req.files_moved_final.splice(index, 1);
    }
    req.files_moved_final.push(finalUserPath);
  }
  
  return {
    userId,
    documents: finalPaths,
    totalFiles: movedFiles.length,
  };
}
```

**Ejemplo con campos específicos:**

```typescript
async processUserContent(
  dto: UserContentDto, 
  movedFiles: { imagenes?: IMovedFileInfo[]; documentos?: IMovedFileInfo[] }, 
  req: IReqCustom
) {
  const userId = dto.userId;
  const result: any = {};
  
  // Procesar imágenes
  if (movedFiles.imagenes && movedFiles.imagenes.length > 0) {
    const imagePaths: string[] = [];
    
    for (const movedFile of movedFiles.imagenes) {
      const finalUserPath = this.fileManipulationService.moveFileOfTempToFinalDest(
        movedFile.filename,
        `fotos/${userId}`,
      );
      
      imagePaths.push(finalUserPath);
      
      // Actualizar req.files_moved_final
      if (!req.files_moved_final) {
        req.files_moved_final = [];
      }
      
      const index = req.files_moved_final.indexOf(movedFile.finalPath);
      if (index > -1) {
        req.files_moved_final.splice(index, 1);
      }
      req.files_moved_final.push(finalUserPath);
    }
    
    result.imagenes = imagePaths;
  }
  
  // Procesar documentos
  if (movedFiles.documentos && movedFiles.documentos.length > 0) {
    const docPaths: string[] = [];
    
    for (const movedFile of movedFiles.documentos) {
      const finalUserPath = this.fileManipulationService.moveFileOfTempToFinalDest(
        movedFile.filename,
        `documentos/${userId}`,
      );
      
      docPaths.push(finalUserPath);
      
      // Actualizar req.files_moved_final
      if (!req.files_moved_final) {
        req.files_moved_final = [];
      }
      
      const index = req.files_moved_final.indexOf(movedFile.finalPath);
      if (index > -1) {
        req.files_moved_final.splice(index, 1);
      }
      req.files_moved_final.push(finalUserPath);
    }
    
    result.documentos = docPaths;
  }
  
  return result;
}
```

**Consideraciones importantes:**

1. ✅ **Siempre actualizar `req.files_moved_final`**: Es obligatorio para que el sistema pueda limpiar los archivos en caso de error
2. ✅ **Remover rutas anteriores**: Eliminar la ruta del `FileMovePipe` y agregar la nueva ruta
3. ✅ **Usar `movedFile.filename`**: El archivo ya está en la ubicación final del `FileMovePipe`, usa ese `filename`
4. ✅ **Manejo de errores**: Si falla el movimiento adicional, el sistema limpiará automáticamente los archivos registrados

## Consideraciones Importantes

### 1. Registro de Archivos Movidos

Es **OBLIGATORIO** registrar las rutas finales de los archivos en `req.files_moved_final`:

```typescript
// ✅ CORRECTO
if (!req.files_moved_final) {
  req.files_moved_final = [];
}
req.files_moved_final.push(finalPath);

// ❌ INCORRECTO - Los archivos quedarán huérfanos
// No registrar en req.files_moved_final
```

### 2. Estructura de Directorios

```
public/
├── statics/    # Archivos estáticos (assets, imágenes por defecto)
└── dinamics/   # Archivos dinámicos (archivos cargados por los usuarios)
    └── temp/   # Archivos cargados temporalmente
    └── .../    # Directorio a donde se moverá el archivo luego de ser procesado
```

### 3. Manejo de Errores

El sistema automáticamente limpia los archivos registrados en `req.files_moved_final` en caso de error. El `HttpExceptionFilter` maneja todos los tipos de carga de archivos.

#### Validaciones Automáticas

Los pipes realizan automáticamente las siguientes validaciones, por lo que **NO necesitas validarlas manualmente** en tu servicio:

- ✅ **Propiedades del archivo**: `filename`, `originalname`, `size`
- ✅ **Tipo de archivo**: Extensiones permitidas por campo
- ✅ **Tamaño de archivo**: Límites específicos por campo
- ✅ **Cantidad de archivos**: Máximo número por campo
- ✅ **Filtrado de archivos malformados**: Archivos sin propiedades válidas

**Ejemplo de lo que NO necesitas hacer:**
```typescript
// ❌ NO HACER - Los pipes ya lo validan
if (!file.filename) {
  throw new Error('Archivo sin nombre válido');
}
if (!file.originalname) {
  throw new Error('Archivo sin nombre original');
}
if (file.size > maxSize) {
  throw new Error('Archivo muy grande');
}
```

#### Estructura de Errores con BaseException

Los pipes de validación utilizan `BaseException` con la propiedad `errors` para proporcionar información detallada sobre los errores de validación:

```typescript
// Ejemplo de respuesta de error para validación de tipo de archivo
{
  "message": "Formato no permitido en campo \"documentos\"",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "traceId": "uuid-unico",
  "errors": [
    {
      "property": "documentos",
      "message": "El archivo \"imagen.jpg\" (2.5MB) tiene un formato no permitido. Los tipos permitidos para este campo son: .pdf, .doc, .docx"
    }
  ]
}

// Ejemplo de respuesta de error para validación de tamaño
{
  "message": "Tamaño excesivo en campo \"imagenes\"",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "traceId": "uuid-unico",
  "errors": [
    {
      "property": "imagenes",
      "message": "El archivo \"foto.jpg\" (3.2MB) excede el tamaño máximo permitido. Tamaño máximo para este campo: 2MB"
    }
  ]
}

// Ejemplo de respuesta de error para validación de cantidad de archivos
{
  "message": "Existen campos con demasiados archivos",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "traceId": "uuid-unico",
  "errors": [
    {
      "property": "imagenes",
      "message": "El campo \"imagenes\" tiene 5 archivos, pero solo se permiten 3 archivos"
    }
  ]
}
```

```typescript
// ✅ El sistema limpia automáticamente:
// - Archivos temporales (request.file, request.files)
// - Archivos con múltiples campos (FileFieldsInterceptor)
// - Archivos movidos a destino final (req.files_moved_final)

try {
  // Tu lógica de procesamiento
} catch (error) {
  // Los archivos se eliminarán automáticamente
  throw new BaseException({
    message: 'Error al procesar archivos',
    error: error,
  });
}
```

## Ejemplos Disponibles

El módulo incluye ejemplos completos en `src/config/multer/examples/`:

- **Controlador**: `file-upload-examples.controller.ts`
- **Servicio**: `file-upload-examples.service.ts`
- **DTOs**: `file-upload.dtos.ts`
- **Interfaces**: `file-upload.interfaces.ts`

### Endpoints de Ejemplo

- `POST /file-upload/examples/single-file` - Carga de archivo único con FileMovePipe
- `POST /file-upload/examples/multiple-files` - Carga de múltiples archivos con FileMovePipe
- `POST /file-upload/examples/field-specific-validation` - Carga con validación específica por campo y FileMovePipe configurado
- `POST /file-upload/examples/user-files` - Carga de archivos de usuario con organización por carpetas (usuarios/{userId}/fotos/ y usuarios/{userId}/documentos/)

## Mejores Prácticas

### ✅ **Mejores Prácticas**

1. **Usar pipes específicos por campo**: Para `FileFieldsInterceptor`, usa `FieldSpecific*` pipes
2. **Evitar `maxCount`**: Usa `FieldSpecificMaxFilesValidationPipe` en lugar de `maxCount`
3. **Usar FileMovePipe**: Para simplificar el código, usa `FileMovePipe` para mover archivos automáticamente
4. **Registrar archivos**: Nunca olvides registrar en `req.files_moved_final` (FileMovePipe lo hace automáticamente)
5. **Confiar en los pipes**: Los pipes validan automáticamente todas las propiedades necesarias
6. **No validar manualmente**: No valides `filename`, `originalname`, `size` en tu servicio

### ✅ **Patrones de Uso**

```typescript
// ✅ CORRECTO - Validación específica por campo
@UseInterceptors(FileFieldsInterceptor([
  { name: 'imagenes' }, // Sin maxCount
  { name: 'documentos' }, // Sin maxCount
]))
@UploadedFiles(
  new FieldSpecificFileTypeValidationPipe({
    imagenes: ['.jpg', '.jpeg', '.png'],
    documentos: ['.pdf', '.doc', '.docx'],
  }),
  new FieldSpecificFileSizeValidationPipe({
    imagenes: 5, // 5MB TOTAL para todas las imágenes
    documentos: 10, // 10MB TOTAL para todos los documentos
  }),
  new FieldSpecificMaxFilesValidationPipe({
    imagenes: 3, // Máximo 3 archivos
    documentos: 1, // Máximo 1 archivo
  }),
)
```

**Nota importante:** `FieldSpecificFileSizeValidationPipe` valida el **tamaño total acumulado** de todos los archivos en el campo. Si se excede el límite, **no se guarda ningún archivo** del campo.

```typescript
// ❌ INCORRECTO - maxCount genera errores genéricos
@UseInterceptors(FileFieldsInterceptor([
  { name: 'imagenes', maxCount: 3 }, // Genera "Unexpected field"
]))
```


### ✅ **En el Servicio**

```typescript
// ✅ CORRECTO - Los pipes ya validaron todo
async processFieldSpecificFiles(dto: MultipleFieldsUploadDto, movedFiles: { imagenes?: IMovedFileInfo[]; documentos?: IMovedFileInfo[] }, _req: IReqCustom) {
  const result: IFieldSpecificResult = {
    id: this.generateId(),
    title: dto.title,
    description: dto.description,
    uploadedAt: new Date(),
  };

  // ✅ El FileMovePipe ya movió los archivos y actualizó req.files_moved_final
  // ✅ Ahora tenemos toda la información de los archivos

  // Procesar imágenes si existen
  if (movedFiles.imagenes && movedFiles.imagenes.length > 0) {
    const processedImages: IFieldSpecificFileResult[] = movedFiles.imagenes.map(
      (movedFile) => ({
        originalName: movedFile.originalname,
        finalPath: movedFile.finalPath,
        size: movedFile.size,
      }),
    );

    result.imagenes = processedImages;
  }

  // Procesar documentos si existen
  if (movedFiles.documentos && movedFiles.documentos.length > 0) {
    const processedDocuments: IFieldSpecificFileResult[] = movedFiles.documentos.map(
      (movedFile) => ({
        originalName: movedFile.originalname,
        finalPath: movedFile.finalPath,
        size: movedFile.size,
      }),
    );

    result.documentos = processedDocuments;
  }

  return result;
}

// ❌ INCORRECTO - Validaciones redundantes
async processFieldSpecificFiles(dto: MultipleFieldsUploadDto, movedFiles: { imagenes?: IMovedFileInfo[]; documentos?: IMovedFileInfo[] }, req: IReqCustom) {
  // ❌ Ya no necesitas validar nada, el FileMovePipe lo hizo todo
  for (const movedFile of movedFiles.imagenes) {
    if (!movedFile.finalPath) { // ❌ Ya validado por pipes
      throw new Error('Ruta final inválida');
    }
  }
}
```

## Troubleshooting

### Error: "El archivo no existe en el directorio temporal"

- Verifica que `PATH_TEMP` esté configurado correctamente
- Asegúrate de que el directorio temporal exista
- Confirma que el archivo se haya subido correctamente

### Error: "Se excedió el tamaño máximo"

- Ajusta el límite en `FileSizeValidationPipe` o `FieldSpecificFileSizeValidationPipe`
- Verifica el tamaño del archivo antes de subirlo

### Error: "Formato no permitido"

- Revisa las extensiones permitidas en `FileTypeValidationPipe` o `FieldSpecificFileTypeValidationPipe`
- Confirma que el archivo tenga la extensión correcta

### Error: "Existen archivos con formato no permitido"

Los pipes de validación específica por campo generan mensajes de error detallados con información del campo específico:

```json
{
  "message": "Existen archivos con formato no permitido",
  "statusCode": 400,
  "errors": [
    {
      "property": "documentos",
      "message": "El archivo \"imagen.jpg\" (2.5MB) tiene un formato no permitido. Los tipos permitidos son: [.pdf, .doc, .docx]"
    }
  ]
}
```

- Verifica que los tipos de archivo coincidan con la configuración del campo
- Confirma que el nombre del campo en el interceptor coincida con la configuración del pipe
- La propiedad `errors` indica exactamente qué campo tuvo el problema

### Error: "Existen archivos con tamaño excesivo"

```json
{
  "message": "Existen archivos con tamaño excesivo",
  "statusCode": 400,
  "errors": [
    {
      "property": "imagenes",
      "message": "Los archivos [\"foto1.jpg\", \"foto2.jpg\", \"foto3.jpg\"] tienen un tamaño total de 6.5MB, pero el límite máximo para este campo es 5MB. No se guardará ningún archivo."
    }
  ]
}
```

**Comportamiento:**
- ✅ **Valida el tamaño total acumulado** de todos los archivos en el campo
- ✅ **Si excede el límite, rechaza TODOS los archivos** del campo
- ✅ **No se guarda ningún archivo** si se excede el límite total
- ✅ **Mensaje claro** indicando qué archivos causaron el problema

### Error: "Existen campos con demasiados archivos"

```json
{
  "message": "Existen campos con demasiados archivos",
  "statusCode": 400,
  "errors": [
    {
      "property": "imagenes",
      "message": "El campo \"imagenes\" tiene 5 archivos, pero solo se permiten 3 archivos"
    }
  ]
}
```

 