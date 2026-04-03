import { Schemas } from 'src/config/database/database.const';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OperacionesModulosEntity } from './operaciones-modulos.entity';

@Entity({ schema: Schemas.AUTH, name: 'modulos' })
export class ModulosEntity {
    @PrimaryGeneratedColumn()
    id_modulo: number;

    @Column({ type: 'varchar', length: 300 })
    nombre_modulo: string;

    @OneToMany(
        () => OperacionesModulosEntity,
        (operacion_modulos) => operacion_modulos.modulo,
    )
    operaciones_modulos: OperacionesModulosEntity[];
}
