'use client';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, ChevronRight, Trash2, Link as LinkIcon, Copy, CheckCircle2, Users, Download } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Document, Procedure } from '@/app/types'
import { handleDownload } from '@/lib/handleDownload'
import Spinner from '@/components/ui/spinner';
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

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

function formatDate(date: string) {
  const now = new Date()
  const targetDate = new Date(date)
  const distance = formatDistanceToNow(targetDate, { 
    addSuffix: true,
    locale: es 
  })
  
  if (now.getTime() - targetDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
    return format(targetDate, "d 'de' MMMM, yyyy", { locale: es })
  }
  
  return distance.charAt(0).toUpperCase() + distance.slice(1)
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
      onDelete()
    } catch (error) {
      console.error('Error al crear link:', error)
      toast.error('Error al crear el link')
    } finally {
      setIsCreatingLink(false)
    }
  }

  return (
    <Card className="hover:shadow-2xl p-4 hover:shadow-slate-500/5 transition-all duration-300 bg-white border-slate-200 relative group">
      <Link href={`/documents/${doc.id}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <FileText className="w-5 h-5 text-slate-100" />
              </div>
              <CardTitle className="text-lg font-medium text-slate-800 line-clamp-1 inline-flex items-center gap-2">
                {doc.name} <ChevronRight className="w-4 h-4 text-slate-400" />
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Link>
      <CardContent>
        <div className="flex justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span title={format(new Date(doc.created_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}>
              {formatDate(doc.created_at)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            {doc.form_config.groups.length} paso{doc.form_config.groups.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              setShowLinkDialog(true)
            }}
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-700 border-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center gap-2 py-5 group/button"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 text-slate-50">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-50">Iniciar Nuevo Trámite</span>
            </div>
          </Button>

          {doc.procedures.length > 0 && (
            <Collapsible
              open={showProcedures}
              onOpenChange={setShowProcedures}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 px-4 transition-all duration-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-slate-600 shrink-0" />
                      <span className="text-sm font-medium">Trámites en Curso</span>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {doc.procedures.length}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ rotate: showProcedures ? 90 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    </motion.div>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <AnimatePresence>
                {showProcedures && (
                  <CollapsibleContent forceMount className="overflow-hidden">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="mt-2 space-y-2"
                    >
                      {doc.procedures.map((procedure, index) => (
                        <motion.div
                          key={procedure.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ 
                            duration: 0.2,
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                          className="group/procedure hover:bg-slate-100 transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`shrink-0 w-2 h-2 rounded-full ${
                                  procedure.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-slate-900 text-sm font-medium truncate">
                                  {procedure.nombre_cliente}
                                </span>
                                <span className={`text-xs font-medium inline-flex items-center ${
                                  procedure.status === 'completed' 
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}>
                                  {procedure.status === 'completed' ? 'Completado' : 'En Proceso'}
                                </span>
                              </div>
                            </div>
                            
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.2,
                                delay: index * 0.05 + 0.1,
                                ease: "easeOut"
                              }}
                              className="flex items-center gap-2 justify-end"
                            >
                              {procedure.status === 'completed' ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-200"
                                    onClick={() => handleDownload(procedure as Procedure, "PDF")}
                                  >
                                    <Download className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="text-xs">PDF</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200"
                                    onClick={() => handleDownload(procedure as Procedure, "WORD")}
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="text-xs">WORD</span>
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200"
                                  onClick={() => handleCopyLink(procedure.id)}
                                >
                                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                                  <span className="text-xs">Copiar Link</span>
                                </Button>
                              )}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CollapsibleContent>
                )}
              </AnimatePresence>
            </Collapsible>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
            className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 border-none"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Documento
          </Button>
        </div>
      </CardContent>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="font-serif">¿Eliminar documento?</DialogTitle>
            <DialogDescription className="text-slate-500">
              Esta acción no se puede deshacer. ¿Está seguro que desea eliminar este documento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
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

      <Dialog open={showLinkDialog} onOpenChange={(open) => {
        setShowLinkDialog(open)
        if (!open) setClientName('')
      }}>
        <DialogContent className="bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="font-serif">Iniciar Nuevo Trámite</DialogTitle>
            <DialogDescription className="text-slate-500">
              Complete los datos del cliente para iniciar un nuevo trámite con este documento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="clientName" className="text-sm font-medium text-slate-700">
                Nombre Completo del Cliente
              </label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500">
                Este nombre se utilizará para identificar el trámite y generar el documento final.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowLinkDialog(false)
                setClientName('')
              }}
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateLink}
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={isCreatingLink || !clientName.trim()}
            >
              {isCreatingLink ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Creando Trámite...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Iniciar Trámite
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-serif">
              <div className="p-2 bg-emerald-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              Trámite Iniciado Exitosamente
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Se ha creado un nuevo trámite para <span className="text-slate-900 font-medium">{clientName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Link para el Cliente
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/procedures/${newProcedureId}`}
                  className="bg-slate-50 border-slate-200 text-slate-900 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  className="shrink-0 text-slate-700 border-slate-200 hover:bg-slate-100 flex items-center gap-2"
                  onClick={() => handleCopyLink(newProcedureId!)}
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Comparta este link con su cliente para que complete el formulario.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadDocuments()
    setLoading(false) 
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

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 my-2">
              <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Documentos<span className="text-emerald-500 text-4xl">.</span></h1>
            </div>
            <p className="text-slate-500 mt-2 text-lg">Gestiona tus documentos y trámites legales</p>
          </div>
          <Link href="/documents/new">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 h-11 shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Crear Documento
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              doc={doc} 
              onDelete={loadDocuments}
            />
          ))}

          {documents.length === 0 && (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-slate-100 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-slate-900 mb-2">No hay documentos</h3>
                  <p className="text-slate-500 text-center mb-6 max-w-sm">
                    Comience creando su primer documento legal para gestionar sus trámites
                  </p>
                  <Link href="/documents/new">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 h-11 shadow-lg hover:shadow-xl transition-all">
                      <Plus className="w-5 h-5 mr-2" />
                      Crear Documento
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