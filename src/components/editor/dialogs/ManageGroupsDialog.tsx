import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormGroup } from '@/types/form'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { CreateGroupDialog } from './CreateGroupDialog'
import { EditGroupDialog } from './EditGroupDialog'

interface ManageGroupsDialogProps {
  isOpen: boolean
  onClose: () => void
  groups: FormGroup[]
  onCreateGroup: (name: string, description: string) => void
  onEditGroup: (id: string, name: string, description: string) => void
  onDeleteGroup: (id: string) => void
}

export function ManageGroupsDialog({
  isOpen,
  onClose,
  groups,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup
}: ManageGroupsDialogProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingGroup, setEditingGroup] = useState<FormGroup | null>(null)

  const handleDelete = (group: FormGroup) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el grupo "${group.name}"?`)) {
      onDeleteGroup(group.id)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Administrar Grupos</DialogTitle>
            <DialogDescription>
              Organiza y gestiona los grupos de variables del formulario.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="mb-4"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Crear Nuevo Grupo
            </Button>

            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-500">{group.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGroup(group)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(group)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {groups.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hay grupos creados. Crea un grupo para empezar a organizar tus variables.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateGroupDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateGroup={onCreateGroup}
      />

      <EditGroupDialog
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        group={editingGroup}
        onEditGroup={onEditGroup}
      />
    </>
  )
} 