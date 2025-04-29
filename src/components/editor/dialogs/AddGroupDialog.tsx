'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormGroup } from '../types'

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
  onSave,
}: AddGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            Crear Grupo de Variables
          </DialogTitle>
          <DialogDescription className="text-sm">
            Los grupos ayudan a organizar las variables del formulario en secciones lógicas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Nombre del Grupo
              </label>
              <Input
                placeholder="Ej: Datos Personales"
                value={group.name}
                onChange={(e) => onGroupChange({ ...group, name: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Descripción
              </label>
              <Textarea
                placeholder="Describe el propósito de este grupo..."
                value={group.description}
                onChange={(e) => onGroupChange({ ...group, description: e.target.value })}
                className="w-full h-24 resize-none"
              />
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Consejos
              </h4>
              <ul className="text-xs space-y-1 text-yellow-700">
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                  Agrupe variables relacionadas
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                  Use nombres descriptivos
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                  Sea conciso y específico
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Ejemplo
            </h4>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded border border-blue-200">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1 h-3 bg-blue-600 rounded"></div>
                  <strong className="text-xs text-blue-900">Datos Personales</strong>
                </div>
                <div className="space-y-1">
                  <code className="text-[10px] px-1 py-0.5 bg-blue-50 rounded text-blue-700 block">{'{{nombre_completo}}'}</code>
                  <code className="text-[10px] px-1 py-0.5 bg-blue-50 rounded text-blue-700 block">{'{{fecha_nacimiento}}'}</code>
                  <code className="text-[10px] px-1 py-0.5 bg-blue-50 rounded text-blue-700 block">{'{{direccion}}'}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!group.name.trim()}
            size="sm"
          >
            Crear Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 