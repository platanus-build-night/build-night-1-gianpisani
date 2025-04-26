'use client';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, ChevronRight, Trash2, Link as LinkIcon, Copy, CheckCircle2, Users } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Document {
  id: string
  name: string
  content: string
  created_at: string
  form_config: {
    groups: Array<{
      id: string
      title: string
      variables: string[]
    }>
  }
  procedures: Array<{
    id: string
    document_id: string
    nombre_cliente: string
    created_at: string
    form_data: any
  }>
}

async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      procedures!procedures_document_id_fkey(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Document[]
}

function DocumentCard({ doc, onDelete }: { doc: Document, onDelete: () => void }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isCreatingLink, setIsCreatingLink] = useState(false)
  const [clientName, setClientName] = useState('')
  const [newProcedureId, setNewProcedureId] = useState<string | null>(null)
  const [showProcedures, setShowProcedures] = useState(false)
  const router = useRouter()

  const handleCopyLink = (procedureId: string) => {
    const link = `${window.location.origin}/procedures/${procedureId}`
    navigator.clipboard.writeText(link)
    toast.success('Link copiado al portapapeles')
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id)

      if (error) throw error
      
      toast.success('Documento eliminado')
      onDelete()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar el documento')
    }
  }

  const handleCreateLink = async () => {
    if (!clientName.trim()) {
      toast.error('Por favor ingresa el nombre del cliente')
      return
    }

    try {
      setIsCreatingLink(true)
      const { data, error } = await supabase
        .from('procedures')
        .insert([
          {
            document_id: doc.id,
            nombre_cliente: clientName,
            form_data: {
              groups: doc.form_config.groups.map(group => ({
                ...group,
                variables: group.variables.reduce((acc, varName) => ({
                  ...acc,
                  [varName]: ''
                }), {})
              }))
            }
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      setNewProcedureId(data.id)
      setShowLinkDialog(false)
      setShowSuccessDialog(true)
      setClientName('')
      onDelete() // Recargar documentos para actualizar la lista de procedures
    } catch (error) {
      console.error('Error al crear link:', error)
      toast.error('Error al crear el link')
    } finally {
      setIsCreatingLink(false)
    }
  }

  return (
    <Card className="hover:shadow-2xl p-4 hover:shadow-blue-500/5 transition-all duration-300 bg-gray-800/50 border-gray-700 relative group">
      <Link href={`/documents/${doc.id}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <CardTitle className="text-lg font-medium text-gray-100 line-clamp-1">
                {doc.name}
              </CardTitle>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        </CardHeader>
      </Link>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>
            {new Date(doc.created_at).toLocaleDateString('es', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
            {doc.form_config.groups.length} grupo{doc.form_config.groups.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-gray-700/50 hover:bg-gray-700"
            onClick={(e) => {
              e.preventDefault()
              setShowLinkDialog(true)
            }}
          >
            <LinkIcon className="h-4 w-4 text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-gray-700/50 hover:bg-red-900/50"
            onClick={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>

        {/* Lista de Procedures */}
        <Collapsible
          open={showProcedures}
          onOpenChange={setShowProcedures}
          className="mt-4"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between bg-gray-700/30 hover:bg-gray-700/50 text-gray-300"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{doc.procedures.length} trámite{doc.procedures.length === 1 ? '' : 's'}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${showProcedures ? 'rotate-90' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {doc.procedures.map((procedure) => (
              <div
                key={procedure.id}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg group/procedure"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-300 text-sm">{procedure.nombre_cliente}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover/procedure:opacity-100 transition-opacity"
                  onClick={() => handleCopyLink(procedure.id)}
                >
                  <Copy className="h-3 w-3 text-gray-400" />
                </Button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>¿Eliminar documento?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar este documento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Crear Link */}
      <Dialog open={showLinkDialog} onOpenChange={(open) => {
        setShowLinkDialog(open)
        if (!open) setClientName('')
      }}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Crear Link de Trámite</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ingresa el nombre del cliente para crear un nuevo trámite
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="clientName" className="text-sm font-medium text-gray-200">
                Nombre del Cliente
              </label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowLinkDialog(false)
                setClientName('')
              }}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateLink}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isCreatingLink || !clientName.trim()}
            >
              {isCreatingLink ? 'Creando...' : 'Crear Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Link Creado Exitosamente */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Trámite Creado Exitosamente
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Se ha creado un nuevo trámite para <span className="text-gray-300 font-medium">{clientName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Link del Trámite
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/procedures/${newProcedureId}`}
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                />
                <Button
                  variant="outline"
                  className="shrink-0 text-gray-300 border-gray-600 hover:bg-gray-700"
                  onClick={() => handleCopyLink(newProcedureId!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Listo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const router = useRouter()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Error loading documents:', error)
      toast.error('Error al cargar los documentos')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Mis Documentos</h1>
            <p className="text-gray-400 mt-2 text-lg">Gestiona tus documentos legales y trámites</p>
          </div>
          <Link href="/documents/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 h-11 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Documento
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              doc={doc} 
              onDelete={loadDocuments}
            />
          ))}

          {documents.length === 0 && (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-gray-700 bg-gray-800/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">No hay documentos</h3>
                  <p className="text-gray-400 text-center mb-6 max-w-sm">
                    Comienza creando tu primer documento legal para gestionar tus trámites
                  </p>
                  <Link href="/documents/new">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 h-11 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo Documento
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
