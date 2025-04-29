'use client'

import '@/styles/editor.css'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import { VariableNode } from './VariableNode'
import { MenuBar } from './MenuBar'
import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface TipTapEditorProps {
  content: string
  onUpdate: (content: string) => void
}

export function TipTapEditor({ content, onUpdate }: TipTapEditorProps) {
  const [showVariableDialog, setShowVariableDialog] = useState(false)
  const [variableName, setVariableName] = useState('')

  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    const html = editor.getHTML()
    onUpdate(html)
  }, [onUpdate])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-serif',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4 font-serif',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
        strike: {
          HTMLAttributes: {
            class: 'line-through',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-4 mb-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-4 mb-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-2',
          },
        },
      }),
      TextStyle.configure({
        HTMLAttributes: {
          class: 'font-serif',
        }
      }),
      FontFamily,
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Placeholder.configure({
        placeholder: 'Comience a escribir su documento aquí...',
        showOnlyWhenEditable: true,
      }),
      VariableNode,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6 font-serif',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Manejar atajos de teclado comunes
          if (event.metaKey || event.ctrlKey) {
            switch (event.key) {
              case 'b':
                event.preventDefault()
                editor?.chain().focus().toggleBold().run()
                return true
              case 'i':
                event.preventDefault()
                editor?.chain().focus().toggleItalic().run()
                return true
              case 'u':
                event.preventDefault()
                editor?.chain().focus().toggleUnderline().run()
                return true
              default:
                return false
            }
          }
          return false
        },
        focus: () => {
          // Asegurar que el editor mantenga el foco
          editor?.chain().focus().run()
          return false
        },
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved) {
          const text = event.dataTransfer?.getData('text/plain')
          if (text) {
            const { tr } = view.state
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
            if (pos) {
              view.dispatch(tr.insertText(text, pos))
              return true
            }
          }
        }
        return false
      },
    },
    onUpdate: handleUpdate,
    onCreate: ({ editor }) => {
      // Establecer el estilo inicial
      editor.chain()
        .setFontFamily('Times New Roman')
        .setTextAlign('left')
        .run()
    },
    onFocus: ({ editor }) => {
      // Mantener el foco cuando se hace clic en el editor
      editor.chain().focus().run()
    },
  })

  const handleAddVariable = useCallback(() => {
    if (variableName.trim() && editor) {
      editor
        .chain()
        .focus()
        .insertContent(`{{${variableName.trim()}}}`)
        .run()
      setVariableName('')
      setShowVariableDialog(false)
    }
  }, [editor, variableName])

  if (!editor) {
    return null
  }

  return (
    <>
      <MenuBar editor={editor} onAddVariable={() => setShowVariableDialog(true)} />
      <div className="editor-container">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6 font-['Times_New_Roman']"
        />
      </div>

      <Dialog open={showVariableDialog} onOpenChange={setShowVariableDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Insertar Variable en el Documento</DialogTitle>
            <DialogDescription className="text-base">
              Las variables son campos que se completarán más tarde a través de un formulario.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">¿Qué es una variable?</h4>
              <p className="text-blue-600 text-sm">
                Una variable es un espacio reservado en tu documento que se reemplazará con información específica cuando alguien complete el formulario. Por ejemplo:
              </p>
              <ul className="mt-2 space-y-2 text-sm text-blue-600">
                <li className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">{'{{nombre_completo}}'}</span>
                  <span>→ Se reemplazará con el nombre de la persona</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white px-2 py-1 rounded border border-blue-200">{'{{fecha_nacimiento}}'}</span>
                  <span>→ Se reemplazará con la fecha de nacimiento</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                Nombre de la Variable
              </label>
              <div className="relative">
                <Input
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  placeholder="Ejemplo: nombre_completo, fecha_nacimiento, direccion"
                  className="pl-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddVariable()
                    }
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {'{{'}
                </span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {'}}'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Use nombres descriptivos sin espacios. Puede usar guiones bajos para separar palabras.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-2">Consejos para nombrar variables</h4>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Use nombres descriptivos (ej: direccion_empresa)</li>
                <li>• Evite espacios (use guiones bajos)</li>
                <li>• Sea específico (ej: fecha_inicio en lugar de fecha)</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setVariableName('')
                setShowVariableDialog(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddVariable}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!variableName.trim()}
            >
              Insertar Variable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 