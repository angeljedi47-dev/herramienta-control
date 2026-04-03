import { Schemas } from 'src/config/database/database.const';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { ModulosEntity } from './modulos.entity';
import { RolesOperacionesEntity } from '../../roles/entities/roles-operaciones.entity';

@Entity({ schema: Schemas.AUTH, name: 'operaciones_modulos' })
export class OperacionesModulosEntity {
    @PrimaryGeneratedColumn()
    id_operacion: number;

    @Column({ type: 'varchar', length: 300 })
    nombre_operacion: string;

    @Column({ type: 'int' })
    id_modulo: number;

    @ManyToOne(() => ModulosEntity, (modulos) => modulos.operaciones_modulos)
    @JoinColumn({ name: 'id_modulo' })
    modulo: ModulosEntity;

    @OneToMany(
        () => RolesOperacionesEntity,
        (roles_operaciones) => roles_operaciones.operacion_modulo,
    )
    roles_operaciones: RolesOperacionesEntity[];
}
