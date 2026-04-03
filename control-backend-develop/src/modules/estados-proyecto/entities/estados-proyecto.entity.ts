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
import { UsuariosSistemaEntity } from 'src/modules/users/entities/usuarios-sistema.entity';
import { ProyectosEntity } from 'src/modules/proyectos/entities/proyectos.entity';

@Entity({ name: 'estados_proyecto' })
export class EstadosProyectoEntity {
    @PrimaryGeneratedColumn()
    id_estado_proyecto: number;

    @Column({ type: 'varchar', length: 150 })
    nombre: string;

    @Column({ type: 'varchar', length: 20, default: '#64748b' })
    color_hex: string;

    @Column({ type: 'boolean', default: false })
    es_final: boolean;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    fecha_creacion: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    fecha_modificacion: Date;

    @Column({ type: 'int', nullable: true })
    id_usuario_creacion: number;

    @Column({ type: 'int', nullable: true })
    id_usuario_modificacion: number;

    @ManyToOne(() => UsuariosSistemaEntity)
    @JoinColumn({ name: 'id_usuario_creacion' })
    usuario_creacion: UsuariosSistemaEntity;

    @ManyToOne(() => UsuariosSistemaEntity)
    @JoinColumn({ name: 'id_usuario_modificacion' })
    usuario_modificacion: UsuariosSistemaEntity;

    @OneToMany(() => ProyectosEntity, (proyecto) => proyecto.estadoProyecto)
    proyectos: ProyectosEntity[];
}    
