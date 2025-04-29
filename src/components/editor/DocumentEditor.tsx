'use client';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Trash2, GripVertical, Save, Eye, Check, ChevronRight, ChevronLeft, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Document } from '@/lib/supabase'

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
      router.push('/documents')
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
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              ← Volver
            </Button>
            <h1 className="text-2xl font-serif font-semibold text-slate-900">
              {initialDocument ? 'Editar Documento' : 'Nuevo Documento'}
            </h1>
          </div>
          <Button
            onClick={() => setShowSaveDialog(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 h-11 shadow-lg hover:shadow-xl transition-all"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Creando...' : 'Crear Documento'}
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl bg-white border-slate-200">
          <CardHeader className="border-b mb-4 bg-gradient-to-r from-slate-50 to-white py-8 px-8">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-serif font-semibold text-slate-900 text-center tracking-tight">
                Constructor de Documentos Legales
              </CardTitle>
              <p className="text-slate-500 text-center text-sm">
                Cree documentos legales profesionales con variables dinámicas
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-2">
              <div className="mb-2 px-4 bg-white">
                <TabsList className="h-10 p-1">
                  <TabsTrigger value="editor" className="data-[state=active]:bg-slate-900 m-1 data-[state=active]:text-white transition-all">
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="form-builder" className="data-[state=active]:bg-slate-900 m-1 data-[state=active]:text-white transition-all">
                    Diseño de Formulario
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative">
                <TabsContent value="editor" className="m-0 outline-none">
                  <TipTapEditor
                    content={editorContent}
                    onUpdate={setEditorContent}
                  />
                </TabsContent>

                <TabsContent value="form-builder" className="m-0 outline-none">
                  {activeTab === 'form-builder' && (
                    <div className="p-8 bg-white">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
                        <div className="w-full lg:max-w-2xl space-y-4">
                          <div>
                            <h3 className="text-2xl font-serif font-semibold text-slate-900 mb-2">
                              Diseño del Formulario
                            </h3>
                            <p className="text-slate-500">
                              Organice las variables de su documento en grupos lógicos para crear un formulario fácil de completar.
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              ¿Cómo funciona?
                            </h4>
                            <ol className="space-y-3 text-sm text-slate-700">
                              <li className="flex gap-3 items-start">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-semibold">1</span>
                                <span>Primero, inserte variables en su documento usando el botón <code className="bg-white px-2 py-0.5 rounded font-mono text-slate-800">Variables</code> en el editor.</span>
                              </li>
                              <li className="flex gap-3 items-start">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-semibold">2</span>
                                <span>Luego, cree grupos para organizar esas variables (por ejemplo: "Datos Personales", "Información Laboral").</span>
                              </li>
                              <li className="flex gap-3 items-start">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-semibold">3</span>
                                <span>Finalmente, asigne cada variable a un grupo desde la lista de "Variables Disponibles".</span>
                              </li>
                            </ol>
                          </div>
                        </div>

                        <div className="flex gap-3 w-full lg:w-auto">
                          <Button
                            onClick={() => setShowPreview(true)}
                            variant="outline"
                            className="flex-1 lg:flex-none bg-white hover:bg-slate-50 text-slate-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Vista Previa
                          </Button>
                          <Button
                            onClick={() => setIsAddingGroup(true)}
                            className="flex-1 lg:flex-none bg-slate-900 hover:bg-slate-800 text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Grupo
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                        <motion.div 
                          className="space-y-4"
                          layout
                        >
                          {formConfig.groups.length > 0 ? (
                            formConfig.groups.map((group) => (
                              <motion.div
                                key={group.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="group"
                              >
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                  <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h3 className="text-lg font-medium text-slate-900">{group.name}</h3>
                                        {group.description && (
                                          <p className="text-sm text-slate-500 mt-1">{group.description}</p>
                                        )}
                                      </div>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setFormConfig(prev => ({
                                              groups: prev.groups.filter(g => g.id !== group.id)
                                            }))
                                          }}
                                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4">
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
                                              className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg group/item hover:bg-slate-100 transition-all"
                                            >
                                              <GripVertical className="h-4 w-4 text-slate-400" />
                                              <div className="flex-1">
                                                <span className="font-mono text-sm text-slate-600">
                                                  {'{{'}{varName}{'}}'}
                                                </span>
                                                <span className="text-xs text-slate-400 ml-2">Variable</span>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover/item:opacity-100 transition-opacity h-7 hover:bg-red-50 hover:text-red-600"
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
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </motion.div>
                                          ))}
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className="text-center py-8 px-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
                                        >
                                          <p className="text-sm text-slate-500">
                                            No hay variables en este grupo aún.
                                            <br />
                                            <span className="text-slate-400">Agregue variables desde el panel derecho.</span>
                                          </p>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-16 px-6 border-2 border-dashed border-slate-200 rounded-xl bg-white"
                            >
                              <div className="max-w-sm mx-auto space-y-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                  <Plus className="w-8 h-8 text-slate-400" />
                                </div>
                                <div>
                                  <h4 className="text-slate-900 font-medium">
                                    Comience creando un grupo
                                  </h4>
                                  <p className="text-slate-500 text-sm mt-1">
                                    Los grupos ayudan a organizar las variables en secciones lógicas del formulario.
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsAddingGroup(true)}
                                  className="bg-white hover:bg-slate-50 text-slate-700"
                                >
                                  Crear primer grupo
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-4">
                            <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-slate-900">Variables Disponibles</h3>
                                <span className="text-sm text-slate-500">
                                  {variables.filter(v => !formConfig.groups.some(g => g.variables.includes(v))).length} sin asignar
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">
                                Variables que aún no han sido asignadas a ningún grupo
                              </p>
                            </div>
                            <div className="p-4 max-h-[500px] overflow-y-auto">
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
                                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                                      >
                                        <div className="flex-1">
                                          <span className="font-mono text-sm text-slate-600 group-hover:text-slate-700">
                                            {'{{'}{varName}{'}}'}
                                          </span>
                                          <span className="text-xs text-slate-400 group-hover:text-slate-500 ml-2">Sin asignar</span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-700 hover:bg-slate-200"
                                          onClick={() => {
                                            if (formConfig.groups.length === 0) {
                                              toast.error('Primero cree un grupo')
                                              return
                                            }
                                            setSelectedVariable(varName)
                                            setShowAddToGroupDialog(true)
                                          }}
                                        >
                                          Asignar
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8 px-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200"
                                  >
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                      <Check className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-500">
                                      No hay variables sin asignar.
                                      <br />
                                      <span className="text-slate-400">Todas las variables están en grupos.</span>
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </div>
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
          <DialogContent className="bg-white text-slate-900 border-slate-200">
            <DialogHeader>
              <DialogTitle className="font-serif">Guardar Documento</DialogTitle>
              <DialogDescription className="text-slate-500">
                Ingrese un nombre para su documento antes de guardarlo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Nombre del documento
                </label>
                <Input
                  id="name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Ej: Contrato de Alquiler"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveDocument}
                className="bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {showAddToGroupDialog && (
          <Dialog open={showAddToGroupDialog} onOpenChange={setShowAddToGroupDialog}>
            <DialogContent className="bg-white text-slate-900 border-slate-200">
              <DialogHeader>
                <DialogTitle className="font-serif">Agregar a Grupo</DialogTitle>
                <DialogDescription className="text-slate-500">
                  Seleccione el grupo al que desea agregar la variable
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={handleAddToGroup}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Seleccione un grupo" />
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
          <DialogContent className="max-w-3xl min-h-[700px] max-h-[700px] flex flex-col p-0 bg-white">
            <div className="px-6 py-4 border-b">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2 font-serif">
                  <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                  Previsualización del Formulario
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Complete los siguientes pasos para generar su documento
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="h-1 bg-slate-200 rounded-full">
                  <div 
                    className="h-1 bg-slate-900 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((previewStep + 1) / formConfig.groups.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {formConfig.groups.map((_, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        index === previewStep 
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : index < previewStep
                          ? 'border-slate-900 bg-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {index < previewStep ? (
                        <Check className="w-4 h-4 text-slate-900" />
                      ) : (
                        <span className={index === previewStep ? 'text-white' : 'text-slate-500'}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
                        <h3 className="text-xl font-serif font-semibold text-slate-900 flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-900 text-sm">
                            {index + 1}
                          </div>
                          {group.name}
                        </h3>
                        {group.description && (
                          <p className="text-sm text-slate-500">{group.description}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {group.variables.map((varName) => (
                          <motion.div
                            key={varName}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200"
                          >
                            <label className="text-sm font-medium text-slate-700 block">
                              {varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <Input
                              placeholder={`Ingrese ${varName.replace(/_/g, ' ').toLowerCase()}`}
                              className="w-full bg-white border-slate-200"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t px-6 py-4 bg-white">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setPreviewStep(prev => Math.max(0, prev - 1))}
                  disabled={previewStep === 0}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">
                    Paso {previewStep + 1} de {formConfig.groups.length}
                  </span>
                  {previewStep < formConfig.groups.length - 1 ? (
                    <Button
                      onClick={() => setPreviewStep(prev => Math.min(formConfig.groups.length - 1, prev + 1))}
                      className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2"
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
      </div>
    </motion.div>
  )
} 