import { Schemas } from 'src/config/database/database.const';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RolesEntity } from '../../roles/entities/roles.entity';
import { UsuariosSistemaEntity } from './usuarios-sistema.entity';

@Entity({ schema: Schemas.AUTH, name: 'roles_usuarios' })
export class RolesUsuariosEntity {
    @PrimaryGeneratedColumn()
    id_rol_usuario: number;

    @Column({ type: 'int' })
    id_rol: number;

    @Column({ type: 'int' })
    id_usuario_sistema: number;

    @Column({ type: 'int', nullable: true })
    id_usuario_creacion: number;

    @Column({ type: 'int', nullable: true })
    id_usuario_eliminacion: number;

    @ManyToOne(() => RolesEntity, (roles) => roles.usuarios_con_rol)
    @JoinColumn({ name: 'id_rol' })
    rol: RolesEntity;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios) => usuarios.roles_asignados,
    )
    @JoinColumn({ name: 'id_usuario_sistema' })
    usuario: UsuariosSistemaEntity;

    @Column()
    activo: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    fecha_asignacion: Date;

    @Column({ type: 'timestamptz', nullable: true })
    fecha_eliminacion: Date;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.asignaciones_roles_realizados,
    )
    @JoinColumn({ name: 'id_usuario_creacion' })
    usuario_creacion: UsuariosSistemaEntity;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.desasignaciones_roles_realizados,
    )
    @JoinColumn({ name: 'id_usuario_eliminacion' })
    usuario_eliminacion: UsuariosSistemaEntity;
}
