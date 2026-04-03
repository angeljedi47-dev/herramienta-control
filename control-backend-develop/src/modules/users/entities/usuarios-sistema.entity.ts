import { Schemas } from 'src/config/database/database.const';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RolesUsuariosEntity } from './roles-usuarios.entity';
import { RolesOperacionesEntity } from '../../roles/entities/roles-operaciones.entity';
import { RolesEntity } from '../../roles/entities/roles.entity';
@Entity({ schema: Schemas.AUTH, name: 'usuarios_sistema' })
export class UsuariosSistemaEntity {
    @PrimaryGeneratedColumn()
    id_usuario_sistema: number;

    @Column({ type: 'varchar', length: 300 })
    nombre_usuario: string;

    @Column({ type: 'varchar', length: 300 })
    password: string;

    @Column()
    activo: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    fecha_creacion: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    fecha_modificacion: Date;

    @Column({ type: 'int', nullable: true })
    id_usuario_creacion: number;

    @Column({ type: 'int', nullable: true })
    id_usuario_modificacion: number;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.usuarios_creados,
    )
    @JoinColumn({ name: 'id_usuario_creacion' })
    usuario_creacion: UsuariosSistemaEntity;

    @OneToMany(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.usuario_creacion,
    )
    usuarios_creados: UsuariosSistemaEntity[];

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.usuarios_modificados,
    )
    @JoinColumn({ name: 'id_usuario_modificacion' })
    usuario_modificacion: UsuariosSistemaEntity;

    @OneToMany(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.usuario_modificacion,
    )
    usuarios_modificados: UsuariosSistemaEntity[];

    @OneToMany(
        () => RolesUsuariosEntity,
        (roles_usuarios) => roles_usuarios.usuario,
    )
    roles_asignados: RolesUsuariosEntity[];

    @OneToMany(
        () => RolesUsuariosEntity,
        (roles_usuarios) => roles_usuarios.usuario_creacion,
    )
    asignaciones_roles_realizados: RolesUsuariosEntity[];

    @OneToMany(
        () => RolesUsuariosEntity,
        (roles_usuarios) => roles_usuarios.usuario_eliminacion,
    )
    desasignaciones_roles_realizados: RolesUsuariosEntity[];

    @OneToMany(
        () => RolesOperacionesEntity,
        (roles_operacion) => roles_operacion.usuario_creacion,
    )
    roles_operaciones_asignaciones_realizadas: RolesOperacionesEntity[];

    @OneToMany(
        () => RolesOperacionesEntity,
        (roles_operacion) => roles_operacion.usuario_eliminacion,
    )
    roles_operaciones_desasignaciones_realizadas: RolesOperacionesEntity[];

    @OneToMany(() => RolesEntity, (roles) => roles.usuario_creacion)
    roles_creados_realizados: RolesEntity[];

    @OneToMany(() => RolesEntity, (roles) => roles.usuario_modificacion)
    roles_modificados_realizados: RolesEntity[];
}
