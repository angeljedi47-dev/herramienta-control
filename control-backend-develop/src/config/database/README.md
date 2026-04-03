# Gestión de Base de Datos y Transacciones

## Introducción

El módulo de base de datos de este proyecto está construido sobre TypeORM y NestJS, proporcionando una integración robusta y flexible para trabajar con PostgreSQL. Además, se ha incorporado soporte para transacciones automáticas usando el decorador `@Transactional()`.

---

## Configuración del Módulo de Base de Datos

El archivo principal de configuración es `src/config/database/database.module.ts`. Aquí se utiliza `TypeOrmModule.forRootAsync` para cargar la configuración de la base de datos de manera dinámica a partir de las variables de entorno.

**Características clave:**
- **Carga automática de entidades:**
  - No es necesario registrar manualmente las entidades en el módulo de base de datos. Basta con usar `TypeOrmModule.forFeature([Entidad])` en el módulo correspondiente y la entidad será detectada automáticamente.
  - Esto facilita el trabajo colaborativo, ya que cada desarrollador puede trabajar con su propio conjunto de entidades sin conflictos.
- **Sincronización automática (solo desarrollo):**
  - La opción `synchronize` está habilitada solo en modo desarrollo, permitiendo la creación automática de tablas al modificar entidades.

```typescript
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            // ...
            useFactory: (envService: EnvsService) => ({
                // ...
                autoLoadEntities: true, // <--- ¡Clave!
                synchronize: serverEnv.ENVIRONMENT === NODE_ENVIROMENTS.DEVELOPMENT,
            }),
            // ...
        }),
    ],
})
export class DatabaseModule {}
```

---

## Uso de Transacciones

Para asegurar la integridad de los datos en operaciones complejas, se utiliza el decorador `@Transactional()` proporcionado por `typeorm-transactional`.

### Ejemplo de uso en un servicio

```typescript
@Injectable()
export class RolesService {
    // ...
    @Transactional()
    async create(createRolDto: CreateRolDto, userAuthenticated: IUserAuthenticated): Promise<IRolesCreateMapped> {
        // Lógica de creación de rol y operaciones asociadas
    }
    // ...
}
```

**Ventajas:**
- Todas las operaciones dentro del método decorado se ejecutan en una única transacción.
- Si ocurre un error, todos los cambios se revierten automáticamente.
- No es necesario gestionar manualmente el `EntityManager` ni el `QueryRunner`.

---

## Buenas Prácticas

- **No registrar entidades manualmente en el módulo de base de datos.** Usa siempre `forFeature` en el módulo donde se requiera la entidad.
- **Utiliza transacciones** para operaciones que involucren múltiples pasos o afecten varias tablas.
- **Evita el uso de `synchronize` en producción.**
- **Centraliza la configuración** de la base de datos en variables de entorno y usa el módulo de entorno para acceder a ellas.
