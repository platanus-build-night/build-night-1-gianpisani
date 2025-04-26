'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { VariableNode } from './VariableNode'
import { MenuBar } from './MenuBar'
import React, { useState } from 'react'
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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
        bold: {},
        italic: {},
        strike: {},
        bulletList: {},
        orderedList: {},
      }),
      Placeholder.configure({
        placeholder: 'Comience a escribir su documento aquí...',
      }),
      VariableNode,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onUpdate(html)
    },
  })

  if (!editor) {
    return null
  }

  const handleAddVariable = () => {
    if (variableName.trim()) {
      editor
        .chain()
        .focus()
        .insertContent(`{{${variableName.trim()}}}`)
        .run()
      setVariableName('')
      setShowVariableDialog(false)
    }
  }

  return (
    <>
      <MenuBar editor={editor} onAddVariable={() => setShowVariableDialog(true)} />
      <div className="editor-container">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6"
        />
      </div>

      <Dialog open={showVariableDialog} onOpenChange={setShowVariableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insertar Variable</DialogTitle>
            <DialogDescription>
              Ingresa el nombre de la variable que deseas insertar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
                placeholder="Nombre de la variable"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddVariable()
                  }
                }}
              />
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
            >
              Insertar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 