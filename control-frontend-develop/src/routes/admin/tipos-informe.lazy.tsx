import { createLazyFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getTiposInforme } from '@/modules/tipos-informe/apis/tiposInforme.api';
import { Button } from '@/components/ui/button';
import { PlusIcon, LinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TipoInformeForm from '@/modules/tipos-informe/components/TipoInformeForm';
import { useState } from 'react';
import { ITipoInforme } from '@/modules/tipos-informe/interfaces/tiposInforme.interface';
import { useDeleteTipoInforme } from '@/modules/tipos-informe/hooks/useDeleteTipoInforme';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Route = createLazyFileRoute('/admin/tipos-informe')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: tiposInforme = [], refetch } = useQuery({
      queryKey: ['GET_TIPOS_INFORME'],
      queryFn: getTiposInforme,
  });

  const { mutate: deleteTipo } = useDeleteTipoInforme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<ITipoInforme | undefined>();

  const handleCreate = () => {
      setSelectedTipo(undefined);
      setIsDialogOpen(true);
  };

  const handleEdit = (tipo: ITipoInforme) => {
      setSelectedTipo(tipo);
      setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
      if (confirm('¿Estás seguro de que deseas eliminar este tipo de informe?')) {
          deleteTipo(id);
      }
  };

  const onFormSuccess = () => {
      setIsDialogOpen(false);
      refetch();
  };

  const copyUrl = (slug: string) => {
      const url = `${window.location.origin}/public/informes/${slug}`;
      navigator.clipboard.writeText(url);
      alert('URL copiada al portapapeles: ' + url);
  };

  return (
      <div className="p-6">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Catálogo: Tipos de Informe</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                      <Button onClick={handleCreate}><PlusIcon className="w-4 h-4 mr-2" /> Agregar</Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>{selectedTipo ? 'Editar Tipo' : 'Crear Tipo de Informe'}</DialogTitle>
                      </DialogHeader>
                      <TipoInformeForm onSuccess={onFormSuccess} tipoToEdit={selectedTipo} />
                  </DialogContent>
              </Dialog>
          </div>

          <div className="bg-white rounded-lg border shadow-sm mt-4">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Slug (URL Amigable)</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {tiposInforme.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">No hay tipos de informe registrados</TableCell>
                          </TableRow>
                      ) : (
                          tiposInforme.map((tipo) => (
                              <TableRow key={tipo.id_tipo_informe}>
                                  <TableCell className="font-medium">{tipo.nombre}</TableCell>
                                  <TableCell>{tipo.slug}</TableCell>
                                  <TableCell className="text-right flex justify-end gap-2">
                                      <Button variant="outline" size="icon" onClick={() => copyUrl(tipo.slug)} title="Copiar URL Pública">
                                          <LinkIcon className="w-4 h-4" />
                                      </Button>
                                      <Button variant="outline" size="icon" onClick={() => handleEdit(tipo)}>
                                          <PencilIcon className="w-4 h-4 text-primary" />
                                      </Button>
                                      <Button variant="outline" size="icon" onClick={() => handleDelete(tipo.id_tipo_informe)}>
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
