import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UsuariosSistemaEntity } from 'src/modules/users/entities/usuarios-sistema.entity';
import { TiposInformeEntity } from 'src/modules/tipos-informe/entities/tipos-informe.entity';
import { EstadosProyectoEntity } from 'src/modules/estados-proyecto/entities/estados-proyecto.entity';

export enum TipoProyecto {
    NUEVO_SISTEMA = 'Nuevo Sistema',
    ACTUALIZACION = 'Actualización',
    MANTENIMIENTO = 'Mantenimiento',
}

@Entity({ name: 'proyectos' })
export class ProyectosEntity {
    @PrimaryGeneratedColumn()
    id_proyecto: number;

    @Column({ type: 'varchar', length: 300 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({
        type: 'enum',
        enum: TipoProyecto,
        default: TipoProyecto.NUEVO_SISTEMA,
    })
    tipo: TipoProyecto;

    @Column({ type: 'int', nullable: true })
    id_estado_proyecto: number;

    @ManyToOne(() => EstadosProyectoEntity, (estado) => estado.proyectos)
    @JoinColumn({ name: 'id_estado_proyecto' })
    estadoProyecto: EstadosProyectoEntity;

    @Column({ type: 'date', nullable: true })
    fecha_inicio: Date;

    @Column({ type: 'date', nullable: true })
    fecha_fin_estimada: Date;

    @Column({ default: true })
    activo: boolean;

    @Column({ type: 'int', default: 0 })
    porcentaje: number;

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

    @Column({ type: 'int', nullable: true })
    id_tipo_informe: number;

    @ManyToOne(() => TiposInformeEntity, (tipo) => tipo.proyectos)
    @JoinColumn({ name: 'id_tipo_informe' })
    tipoInforme: TiposInformeEntity;
}
