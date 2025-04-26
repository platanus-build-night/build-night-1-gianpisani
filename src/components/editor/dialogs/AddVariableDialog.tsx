import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Variable } from '../types'

interface AddVariableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variable: Variable
  onVariableChange: (variable: Variable) => void
  onSave: () => void
}

export function AddVariableDialog({
  open,
  onOpenChange,
  variable,
  onVariableChange,
  onSave
}: AddVariableDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Variable</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre de la variable</Label>
            <Input
              id="name"
              value={variable.name}
              onChange={(e) => onVariableChange({ ...variable, name: e.target.value })}
              placeholder="ej: nombre_cliente"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={variable.placeholder}
              onChange={(e) => onVariableChange({ ...variable, placeholder: e.target.value })}
              placeholder="ej: Ingrese el nombre completo del cliente"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave}>
            Agregar Variable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 