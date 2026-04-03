import { createLazyFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getEstadosProyecto } from '@/modules/estados-proyecto/apis/estadosProyecto.api';
import { Button } from '@/components/ui/button';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EstadoProyectoForm from '@/modules/estados-proyecto/components/EstadoProyectoForm';
import { useState } from 'react';
import { IEstadoProyecto } from '@/modules/estados-proyecto/interfaces/estadosProyecto.interface';
import { useDeleteEstadoProyecto } from '@/modules/estados-proyecto/hooks/useDeleteEstadoProyecto';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Route = createLazyFileRoute('/admin/estados-proyecto')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: estados = [], refetch } = useQuery({
      queryKey: ['GET_ESTADOS_PROYECTO'] as any,
      queryFn: getEstadosProyecto,
  });

  const { mutate: deleteEstado } = useDeleteEstadoProyecto();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<IEstadoProyecto | undefined>();

  const handleCreate = () => {
      setSelectedEstado(undefined);
      setIsDialogOpen(true);
  };

  const handleEdit = (estado: IEstadoProyecto) => {
      setSelectedEstado(estado);
      setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
      if (confirm('¿Estás seguro de que deseas eliminar este estado?')) {
          deleteEstado(id);
      }
  };

  const onFormSuccess = () => {
      setIsDialogOpen(false);
      refetch();
  };

  return (
      <div className="p-6">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Catálogo: Estados de Proyecto</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                      <Button onClick={handleCreate}><PlusIcon className="w-4 h-4 mr-2" /> Agregar</Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>{selectedEstado ? 'Editar Estado' : 'Crear Estado de Proyecto'}</DialogTitle>
                      </DialogHeader>
                      <EstadoProyectoForm onSuccess={onFormSuccess} estadoToEdit={selectedEstado} />
                  </DialogContent>
              </Dialog>
          </div>

          <div className="bg-white rounded-lg border shadow-sm mt-4">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Es Final</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {estados.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={4} className="text-center py-4">No hay estados registrados</TableCell>
                          </TableRow>
                      ) : (
                          estados.map((estado) => (
                              <TableRow key={estado.id_estado_proyecto}>
                                  <TableCell className="font-medium">{estado.nombre}</TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded border" style={{ backgroundColor: estado.color_hex }}></div>
                                          <span className="text-xs text-gray-500">{estado.color_hex}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {estado.es_final ? (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Sí</span>
                                      ) : (
                                        <span className="px-2 py-1 text-gray-500 text-xs">No</span>
                                      )}
                                  </TableCell>
                                  <TableCell className="text-right flex justify-end gap-2">
                                      <Button variant="outline" size="icon" onClick={() => handleEdit(estado)}>
                                          <PencilIcon className="w-4 h-4 text-primary" />
                                      </Button>
                                      <Button variant="outline" size="icon" onClick={() => handleDelete(estado.id_estado_proyecto)}>
                                          <TrashIcon className="w-4 h-4 text-red-500" />
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))
                      )}
                  </TableBody>
              </Table>
          </div>
      </div>
  );
}
