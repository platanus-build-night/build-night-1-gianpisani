import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Separator } from '../ui/separator'
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Highlighter,
  Variable as VariableIcon,
  Type,
  Palette,
  Minus
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useCallback } from 'react'

interface MenuBarProps {
  editor: Editor | null
  onAddVariable: () => void
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px']
const TEXT_COLORS = [
  { color: '#000000', name: 'Negro' },
  { color: '#DC2626', name: 'Rojo' },
  { color: '#059669', name: 'Verde' },
  { color: '#2563EB', name: 'Azul' },
  { color: '#7C3AED', name: 'Violeta' },
  { color: '#DB2777', name: 'Rosa' },
  { color: '#D97706', name: 'Naranja' },
  { color: '#4B5563', name: 'Gris' }
]

export function MenuBar({ editor, onAddVariable }: MenuBarProps) {
  if (!editor) return null

  const handleCommand = useCallback((callback: () => boolean) => {
    return () => {
      editor.chain().focus()
      callback()
    }
  }, [editor])

  const MenuButton = ({ onClick, isActive, icon: Icon, tooltip }: any) => (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`h-8 w-8 p-0 rounded-md flex items-center justify-center transition-all duration-200 ${
            isActive
              ? 'bg-blue-100 text-blue-800 shadow-inner'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()} // Prevenir pérdida de foco
        >
          <Icon className="h-4 w-4" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs bg-gray-900 text-white">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-wrap items-center"
    >
      {/* Font Family & Size */}
      <div className="flex items-center gap-2">
        <Select
          value={editor.getAttributes('textStyle').fontFamily || 'Times New Roman'}
          onValueChange={(value) => {
            editor.chain().focus().setFontFamily(value).run()
          }}
        >
          <SelectTrigger className="w-[180px] h-8">
            <Type className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Times New Roman" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={editor.getAttributes('textStyle').fontSize || '16px'}
          onValueChange={(value) => {
            editor.chain().focus().setFontSize(value).run()
          }}
        >
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue placeholder="16px" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleBold().run())}
          isActive={editor.isActive('bold')}
          icon={Bold}
          tooltip="Negrita (⌘+B)"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleItalic().run())}
          isActive={editor.isActive('italic')}
          icon={Italic}
          tooltip="Cursiva (⌘+I)"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleUnderline().run())}
          isActive={editor.isActive('underline')}
          icon={Underline}
          tooltip="Subrayado (⌘+U)"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleStrike().run())}
          isActive={editor.isActive('strike')}
          icon={Minus}
          tooltip="Tachado"
        />
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={handleCommand(() => editor.chain().setTextAlign('left').run())}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          tooltip="Alinear a la izquierda"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().setTextAlign('center').run())}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          tooltip="Centrar"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().setTextAlign('right').run())}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          tooltip="Alinear a la derecha"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().setTextAlign('justify').run())}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          tooltip="Justificar"
        />
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleHeading({ level: 1 }).run())}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          tooltip="Título 1"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleHeading({ level: 2 }).run())}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          tooltip="Título 2"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleHeading({ level: 3 }).run())}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          tooltip="Título 3"
        />
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleBulletList().run())}
          isActive={editor.isActive('bulletList')}
          icon={List}
          tooltip="Lista con viñetas"
        />
        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleOrderedList().run())}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          tooltip="Lista numerada"
        />
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      {/* Colors */}
      <div className="flex items-center gap-1">
        <Select
          value={editor.getAttributes('textStyle').color}
          onValueChange={(value) => {
            editor.chain().focus().setColor(value).run()
          }}
        >
          <SelectTrigger className="w-[40px] h-8 p-1">
            <Palette className="w-4 h-4" />
          </SelectTrigger>
          <SelectContent>
            <div className="grid grid-cols-4 gap-1 p-2">
              {TEXT_COLORS.map(({ color, name }) => (
                <Tooltip key={color} delayDuration={50}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform border border-gray-200"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                      }}
                      onMouseDown={(e) => e.preventDefault()} // Prevenir pérdida de foco
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs bg-gray-900 text-white">
                    {name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </SelectContent>
        </Select>

        <MenuButton
          onClick={handleCommand(() => editor.chain().toggleHighlight().run())}
          isActive={editor.isActive('highlight')}
          icon={Highlighter}
          tooltip="Resaltar texto"
        />
      </div>

      <Separator orientation="vertical" className="mx-2 h-6 my-auto bg-gray-200" />

      {/* Variables */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={onAddVariable}
          icon={VariableIcon}
          tooltip="Agregar Variable"
        />
      </div>
    </motion.div>
  )
} 