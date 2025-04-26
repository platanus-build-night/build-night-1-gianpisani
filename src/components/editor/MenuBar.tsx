import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Separator } from '../ui/separator'
import { Bold, Italic, Variable as VariableIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { motion } from 'framer-motion'

interface MenuBarProps {
  editor: Editor | null
  onAddVariable: () => void
}

export function MenuBar({ editor, onAddVariable }: MenuBarProps) {
  if (!editor) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white"
    >
      <div className="flex items-center gap-1">
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-all duration-200 ${
                editor.isActive('bold')
                  ? 'bg-blue-100 text-blue-800 shadow-inner'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs bg-gray-900 text-white">
            Negrita
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-all duration-200 ${
                editor.isActive('italic')
                  ? 'bg-blue-100 text-blue-800 shadow-inner'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs bg-gray-900 text-white">
            Cursiva
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      <div className="flex items-center gap-1">
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-8 w-8 p-0 rounded-md flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-all duration-200"
              onClick={onAddVariable}
            >
              <VariableIcon className="h-4 w-4" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs bg-gray-900 text-white">
            Agregar Variable
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  )
} 