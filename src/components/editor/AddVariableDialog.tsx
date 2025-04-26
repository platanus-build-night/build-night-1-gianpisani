import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Variable } from "./types"
import { useState } from "react"

interface AddVariableDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (variable: Variable) => void;
}

export function AddVariableDialog({
  isOpen,
  onOpenChange,
  onAdd,
}: AddVariableDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ name})
    setName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Agregar Variable
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Agrega una nueva variable al documento. Esta variable será reemplazada por el valor que ingrese el cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Client Name"
              className="bg-slate-800 border-slate-700 text-slate-200 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Agregar Variable
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 