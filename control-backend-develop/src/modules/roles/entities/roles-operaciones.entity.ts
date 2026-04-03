import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OperacionesModulosEntity } from '../../modulos/entities/operaciones-modulos.entity';
import { Schemas } from 'src/config/database/database.const';
import { RolesEntity } from './roles.entity';
import { UsuariosSistemaEntity } from '../../users/entities/usuarios-sistema.entity';
@Entity('roles_operaciones', { schema: Schemas.AUTH })
export class RolesOperacionesEntity {
    @PrimaryGeneratedColumn()
    id_rol_operacion: number;

    @Column({ type: 'int' })
    id_rol: number;

    @Column({ type: 'int' })
    id_operacion: number;

    @Column({ type: 'int', nullable: true })
    id_usuario_creacion: number;

    @Column({ type: 'int', nullable: true })
    id_usuario_eliminacion: number;

    @ManyToOne(() => RolesEntity, (roles) => roles.roles_operaciones)
    @JoinColumn({ name: 'id_rol' })
    rol: RolesEntity;

    @ManyToOne(
        () => OperacionesModulosEntity,
        (operaciones_modulos) => operaciones_modulos.roles_operaciones,
    )
    @JoinColumn({ name: 'id_operacion' })
    operacion_modulo: OperacionesModulosEntity;

    @Column()
    activo: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    fecha_creacion: Date;

    @Column({ type: 'timestamptz', nullable: true })
    fecha_eliminacion: Date;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios) => usuarios.roles_operaciones_asignaciones_realizadas,
    )
    @JoinColumn({ name: 'id_usuario_creacion' })
    usuario_creacion: UsuariosSistemaEntity;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios) => usuarios.roles_operaciones_desasignaciones_realizadas,
    )
    @JoinColumn({ name: 'id_usuario_eliminacion' })
    usuario_eliminacion: UsuariosSistemaEntity;
}
