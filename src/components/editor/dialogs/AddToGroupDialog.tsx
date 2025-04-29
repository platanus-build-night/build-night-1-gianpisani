import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { FormConfig } from '@/types'
import { Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AddToGroupDialogProps {
  isOpen: boolean
  onClose: () => void
  groups: FormConfig['groups']
  selectedVariable: string
  onAddToGroup: (groupId: string) => void
}

export function AddToGroupDialog({
  isOpen,
  onClose,
  groups,
  selectedVariable,
  onAddToGroup
}: AddToGroupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[600px] h-[90vh] md:h-auto flex flex-col p-0">
        <div className="px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              Asignar Variable a un Grupo
            </DialogTitle>
            <DialogDescription className="text-base">
              Seleccione el grupo al que desea asignar la variable{' '}
              <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm text-blue-600">
                {'{{'}{selectedVariable}{'}}'}
              </code>
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-3">
            {groups.map((group) => (
              <motion.button
                key={group.id}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => {
                  onAddToGroup(group.id)
                  onClose()
                }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all text-left group relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {group.name}
                      </h4>
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {group.variables.length} variables
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.description}</p>
                    )}
                    {group.variables.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {group.variables.slice(0, 2).map((variable) => (
                          <span
                            key={variable}
                            className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-xs font-mono text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors"
                          >
                            {'{{'}{variable}{'}}'}
                          </span>
                        ))}
                        {group.variables.length > 2 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            +{group.variables.length - 2} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center self-center">
                    <span className="shrink-0 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Asignar
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}

            {groups.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  No hay grupos disponibles.
                  <br />
                  <span className="text-gray-400">Cree un grupo primero para poder asignar variables.</span>
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t px-6 py-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 