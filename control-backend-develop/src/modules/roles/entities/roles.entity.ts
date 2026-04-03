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
import { RolesOperacionesEntity } from './roles-operaciones.entity';
import { RolesUsuariosEntity } from '../../users/entities/roles-usuarios.entity';
import { UsuariosSistemaEntity } from 'src/modules/users/entities/usuarios-sistema.entity';

@Entity({ schema: Schemas.AUTH, name: 'roles' })
export class RolesEntity {
    @PrimaryGeneratedColumn()
    id_rol: number;

    @Column({ type: 'varchar', length: 300 })
    nombre_rol: string;

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
        (usuarios_sistema) => usuarios_sistema.roles_creados_realizados,
    )
    @JoinColumn({ name: 'id_usuario_creacion' })
    usuario_creacion: UsuariosSistemaEntity;

    @ManyToOne(
        () => UsuariosSistemaEntity,
        (usuarios_sistema) => usuarios_sistema.roles_modificados_realizados,
    )
    @JoinColumn({ name: 'id_usuario_modificacion' })
    usuario_modificacion: UsuariosSistemaEntity;

    @OneToMany(
        () => RolesOperacionesEntity,
        (roles_operaciones) => roles_operaciones.rol,
    )
    roles_operaciones: RolesOperacionesEntity[];

    @OneToMany(
        () => RolesUsuariosEntity,
        (roles_usuarios) => roles_usuarios.rol,
    )
    usuarios_con_rol: RolesUsuariosEntity[];
}
