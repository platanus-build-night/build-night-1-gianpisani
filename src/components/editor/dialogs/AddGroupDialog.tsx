'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { FormGroup } from '../types'
import { Textarea } from '../../ui/textarea'

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: Omit<FormGroup, 'id'>
  onGroupChange: (group: Omit<FormGroup, 'id'>) => void
  onSave: () => void
}

export function AddGroupDialog({
  open,
  onOpenChange,
  group,
  onGroupChange,
  onSave
}: AddGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Grupo</DialogTitle>
          <DialogDescription>
            Crea un nuevo grupo para organizar las variables del formulario
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del grupo
            </label>
            <Input
              id="name"
              value={group.name}
              onChange={(e) => onGroupChange({ ...group, name: e.target.value })}
              placeholder="Ej: Datos del Cliente"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <Textarea
              id="description"
              value={group.description}
              onChange={(e) => onGroupChange({ ...group, description: e.target.value })}
              placeholder="Ej: Información personal del cliente"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!group.name.trim()}
          >
            Agregar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 