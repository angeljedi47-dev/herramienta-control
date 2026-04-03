import { IProjectDB, IProjectMapped, IProjectStatusDB, IProjectStatusMapped } from '../interfaces';

export class ProjectMapper {
    static toMapped(data: IProjectDB): IProjectMapped {
        return {
            idProyecto: data.id_proyecto,
            nombre: data.nombre,
            descripcion: data.descripcion,
            tipo: data.tipo,
            id_estado_proyecto: data.id_estado_proyecto,
            estadoProyecto: data.estadoProyecto,
            fechaInicio: data.fecha_inicio ? new Date(data.fecha_inicio) : null,
            fechaFinEstimada: data.fecha_fin_estimada ? new Date(data.fecha_fin_estimada) : null,
            fechaCreacion: new Date(data.fecha_creacion),
            fechaModificacion: new Date(data.fecha_modificacion),
            porcentaje: data.porcentaje,
            id_tipo_informe: data.id_tipo_informe,
            tipoInforme: data.tipoInforme,
            activo: data.activo,
        };
    }

    static toPaginateArray(data: IProjectDB[]): IProjectMapped[] {
        return data.map((item) => ProjectMapper.toMapped(item));
    }

    static toStatusMapped(data: IProjectStatusDB): IProjectStatusMapped {
        return {
            idProyecto: data.id_proyecto,
            nombre: data.nombre,
            tipo: data.tipo,
            id_estado_proyecto: data.id_estado_proyecto,
            estadoProyecto: data.estadoProyecto,
            fechaInicio: data.fecha_inicio ? new Date(data.fecha_inicio) : null,
            fechaFinEstimada: data.fecha_fin_estimada ? new Date(data.fecha_fin_estimada) : null,
            porcentaje: data.porcentaje,
        };
    }

    static toStatusArray(data: IProjectStatusDB[]): IProjectStatusMapped[] {
        return data.map((item) => ProjectMapper.toStatusMapped(item));
    }
}
