import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { FormGroup } from '../types'

interface SelectGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: FormGroup[]
  onGroupSelect: (groupId: string) => void
}

export function SelectGroupDialog({
  open,
  onOpenChange,
  groups,
  onGroupSelect
}: SelectGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar Grupo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {groups.map(group => (
            <Button
              key={group.id}
              variant="outline"
              className="justify-start h-auto py-3"
              onClick={() => onGroupSelect(group.id)}
            >
              <div className="text-left">
                <div className="font-medium">{group.title}</div>
                <div className="text-sm text-gray-500">{group.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 