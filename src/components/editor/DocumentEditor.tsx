'use client';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Trash2, GripVertical, Save, Eye, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Document } from '@/lib/supabase'

import { MenuBar } from './MenuBar'
import { AddVariableDialog } from './dialogs/AddVariableDialog'
import { AddGroupDialog } from './dialogs/AddGroupDialog'
import { FormPreview } from './previews/FormPreview'
import { VariableNode } from './VariableNode'
import { Variable, FormConfig, FormGroup } from './types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Input } from '../ui/input'
import { saveDocument } from '@/lib/supabase'
import { TipTapEditor } from './TipTapEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface DocumentEditorProps {
  initialDocument?: Document | null
}

function extractVariables(content: string): string[] {
  const matches = content.match(/{{([^}]+)}}/g) || []
  return matches.map(match => match.slice(2, -2))
}

export default function DocumentEditor({ initialDocument }: DocumentEditorProps) {
  const router = useRouter()
  const [editorContent, setEditorContent] = useState(initialDocument?.content ?? '')
  const [activeTab, setActiveTab] = useState('editor')
  const [formConfig, setFormConfig] = useState<FormConfig>({ groups: [] })
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroup, setNewGroup] = useState<Omit<FormGroup, 'id'>>({
    name: '',
    description: '',
    variables: []
  })
  const [documentName, setDocumentName] = useState(initialDocument?.name ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null)
  const [showAddToGroupDialog, setShowAddToGroupDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewStep, setPreviewStep] = useState(0)

  const variables = extractVariables(editorContent)

  const handleAddGroup = () => {
    setFormConfig(prev => ({
      groups: [
        ...prev.groups,
        {
          id: crypto.randomUUID(),
          name: newGroup.name,
          description: newGroup.description,
          variables: []
        }
      ]
    }))
    setNewGroup({ name: '', description: '', variables: [] })
    setIsAddingGroup(false)
  }

  const handleSaveDocument = async () => {
    if (!documentName.trim()) {
      toast.error('Por favor ingresa un nombre para el documento')
      return
    }

    if (!editorContent) {
      toast.error('El documento está vacío')
      return
    }

    if (formConfig.groups.length === 0) {
      toast.error('Debes crear al menos un grupo de variables')
      return
    }

    try {
      setIsSaving(true)
      await saveDocument(
        documentName,
        editorContent,
        formConfig as unknown as Document['form_config']
      )
      toast.success('Documento guardado')
      router.push('/')
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddToGroup = (groupId: string) => {
    if (!selectedVariable) return
    
    setFormConfig(prev => ({
      groups: prev.groups.map(group =>
        group.id === groupId
          ? { ...group, variables: [...group.variables, selectedVariable] }
          : group
      )
    }))
    
    setShowAddToGroupDialog(false)
    setSelectedVariable(null)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl min-h-screen mx-auto p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="text-gray-500"
          >
            ← Volver
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {initialDocument ? 'Editar Documento' : 'Nuevo Documento'}
          </h1>
        </div>
        <Button
          onClick={() => setShowSaveDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Documento'}
        </Button>
      </div>

      <Card className="overflow-hidden shadow-xl bg-white">
        <CardHeader className="border-b mb-4 bg-gray-50 py-8 px-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold text-gray-800 text-center tracking-tight">
              Constructor de Documentos Legales
            </CardTitle>
            <p className="text-gray-500 text-center text-sm">
              Crea documentos legales profesionales con variables dinámicas
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-2">
            <div className="mb-2 px-4 bg-white">
              <TabsList className="h-10 p-1">
                <TabsTrigger value="editor" className="data-[state=active]:bg-blue-600 m-1 data-[state=active]:text-white transition-all">
                  Editor
                </TabsTrigger>
                <TabsTrigger value="form-builder" className="data-[state=active]:bg-blue-600 m-1 data-[state=active]:text-white transition-all">
                  Diseño de Formulario
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="editor" className="m-0">
                  <TipTapEditor
                    content={editorContent}
                    onUpdate={setEditorContent}
                  />
                </TabsContent>

                <TabsContent value="form-builder" className="m-0">
                  <div className="p-8 bg-white">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Diseño del Formulario
                        </h3>
                        <p className="text-gray-500 mt-2">Organiza las variables en grupos para crear el formulario</p>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
                          onClick={() => setShowPreview(true)}
                        >
                          <Eye className="w-4 h-4" />
                          Previsualizar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                          onClick={() => setIsAddingGroup(true)}
                        >
                          Agregar Grupo
                        </motion.button>
                      </div>
                    </div>

                    <AnimatePresence>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
                        <motion.div 
                          className="space-y-4"
                          layout
                        >
                          {formConfig.groups.map((group) => (
                            <motion.div
                              key={group.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="group"
                            >
                              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle className="text-lg font-semibold text-gray-900">{group.name}</CardTitle>
                                      <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => {
                                        setFormConfig(prev => ({
                                          groups: prev.groups.filter(g => g.id !== group.id)
                                        }))
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <AnimatePresence>
                                    {group.variables.length > 0 ? (
                                      <motion.div layout className="space-y-2">
                                        {group.variables.map((varName) => (
                                          <motion.div
                                            key={varName}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group/item hover:bg-gray-100 transition-colors"
                                          >
                                            <GripVertical className="h-4 w-4 text-gray-400" />
                                            <span className="flex-1 text-gray-700">{varName}</span>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                                              onClick={() => {
                                                setFormConfig(prev => ({
                                                  groups: prev.groups.map(g => 
                                                    g.id === group.id
                                                      ? { ...g, variables: g.variables.filter(v => v !== varName) }
                                                      : g
                                                  )
                                                }))
                                              }}
                                            >
                                              <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500 transition-colors" />
                                            </Button>
                                          </motion.div>
                                        ))}
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8 text-gray-500"
                                      >
                                        No hay variables en este grupo
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}

                          {formConfig.groups.length === 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                            >
                              <p className="text-gray-500 mb-4">No hay grupos creados</p>
                              <Button
                                variant="outline"
                                onClick={() => setIsAddingGroup(true)}
                                className="bg-white hover:bg-gray-50 border-gray-200"
                              >
                                Crear primer grupo
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>

                        <div className="space-y-6">
                          <Card className="border border-gray-200 shadow-md sticky top-4">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">Variables Disponibles</CardTitle>
                                <span className="text-sm text-gray-500">{variables.length - formConfig.groups.reduce((acc, g) => acc + g.variables.length, 0)} variables</span>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 max-h-[500px] overflow-y-auto">
                              <AnimatePresence>
                                {variables.filter(v => !formConfig.groups.some(g => g.variables.includes(v))).length > 0 ? (
                                  <motion.div layout className="space-y-2">
                                    {variables.filter(v => !formConfig.groups.some(g => g.variables.includes(v))).map(varName => (
                                      <motion.div
                                        key={varName}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                                      >
                                        <span className="flex-1 text-gray-700">{varName}</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                          onClick={() => {
                                            if (formConfig.groups.length === 0) {
                                              toast.error('Primero crea un grupo')
                                              return
                                            }
                                            setSelectedVariable(varName)
                                            setShowAddToGroupDialog(true)
                                          }}
                                        >
                                          Agregar a Grupo
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8 text-gray-500"
                                  >
                                    No hay variables disponibles
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </AnimatePresence>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>

      <AddGroupDialog
        open={isAddingGroup}
        onOpenChange={setIsAddingGroup}
        group={newGroup}
        onGroupChange={setNewGroup}
        onSave={handleAddGroup}
      />

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar Documento</DialogTitle>
            <DialogDescription>
              Ingresa un nombre para tu documento antes de guardarlo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre del documento
              </label>
              <Input
                id="name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Ej: Contrato de Alquiler"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showAddToGroupDialog && (
        <Dialog open={showAddToGroupDialog} onOpenChange={setShowAddToGroupDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar a Grupo</DialogTitle>
              <DialogDescription>
                Selecciona el grupo al que deseas agregar la variable
              </DialogDescription>
            </DialogHeader>
            <Select onValueChange={handleAddToGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un grupo" />
              </SelectTrigger>
              <SelectContent>
                {formConfig.groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl min-h-[700px] max-h-[700px] flex flex-col p-0">
          <div className="px-6 py-4 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                Previsualización del Formulario
              </DialogTitle>
              <DialogDescription>
                Complete los siguientes pasos para generar su documento
              </DialogDescription>
            </DialogHeader>

            {/* Progress Bar - Fixed at top */}
            <div className="mt-4">
              <div className="h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((previewStep + 1) / formConfig.groups.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {formConfig.groups.map((_, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      index === previewStep 
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : index < previewStep
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {index < previewStep ? (
                      <Check className="w-4 h-4 text-blue-600" />
                    ) : (
                      <span className={index === previewStep ? 'text-white' : 'text-gray-500'}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <AnimatePresence mode="wait">
              {formConfig.groups.map((group, index) => (
                index === previewStep && (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">
                          {index + 1}
                        </div>
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-gray-500">{group.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {group.variables.map((varName) => (
                        <motion.div
                          key={varName}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100"
                        >
                          <label className="text-sm font-medium text-gray-700 block">
                            {varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <Input
                            placeholder={`Ingrese ${varName.replace(/_/g, ' ').toLowerCase()}`}
                            className="w-full bg-white"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Fixed Navigation Footer */}
          <div className="border-t px-6 py-4 bg-white">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setPreviewStep(prev => Math.max(0, prev - 1))}
                disabled={previewStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Paso {previewStep + 1} de {formConfig.groups.length}
                </span>
                {previewStep < formConfig.groups.length - 1 ? (
                  <Button
                    onClick={() => setPreviewStep(prev => Math.min(formConfig.groups.length - 1, prev + 1))}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowPreview(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                  >
                    Finalizar
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 