'use client'

import { useEffect, useState, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/ui/spinner'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface FormData {
  groups: {
    id: string
    name: string
    variables: Record<string, string>
    description: string
  }[]
}

export default function ProcedurePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = formData ? formData.groups.length + 1 : 0 // +1 for confirmation step
  const isLastStep = currentStep === totalSteps - 1
  const isConfirmationStep = currentStep === formData?.groups.length

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        const { data: procedure, error } = await supabase
          .from('procedures')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setFormData(procedure.form_data)
      } catch (error) {
        toast.error('Error al cargar el formulario')
      } finally {
        setLoading(false)
      }
    }

    fetchProcedure()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !isConfirmationStep) return

    try {
      setIsSubmitting(true)
      const updatedFormData = {
        ...formData,
        groups: formData.groups.map(group => ({
          ...group,
          variables: {
            ...group.variables,
            ...Object.fromEntries(
              Object.entries(values).filter(([key]) => 
                Object.keys(group.variables).includes(key)
              )
            )
          }
        }))
      }

      const { error } = await supabase
        .from('procedures')
        .update({
          form_data: updatedFormData,
          status: 'completed',
        })
        .eq('id', id)

      if (error) throw error
      
      setShowSuccessModal(true)
      setTimeout(() => {
        router.push('/')
      }, 5000)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar el formulario')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No se encontró el formulario</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="shadow-lg min-h-[700px] flex flex-col">
            <CardHeader className="text-center border-b bg-white px-6 py-4">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                {isConfirmationStep ? 'Confirmar y Enviar' : 'Complete el Formulario'}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                {isConfirmationStep 
                  ? 'Revise la información y confirme el envío'
                  : 'Complete los siguientes pasos para generar su documento'}
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-1 bg-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {[...Array(totalSteps)].map((_, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        index === currentStep 
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : index < currentStep
                          ? 'border-blue-600 bg-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="w-4 h-4 text-blue-600" />
                      ) : (
                        <span className={index === currentStep ? 'text-white' : 'text-gray-500'}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>

            {/* Scrollable Form Content */}
            <CardContent className="flex-1 overflow-y-auto p-6">
              <form id="procedureForm" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {isConfirmationStep ? (
                    <motion.div
                      key="confirmation"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {formData.groups.map((group) => (
                        <div key={group.id} className="space-y-4">
                          <h4 className="font-medium text-gray-900">{group.name}</h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {Object.keys(group.variables).map((variable) => (
                              <div key={variable} className="grid grid-cols-2 gap-2">
                                <span className="text-gray-600">
                                  {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                </span>
                                <span className="font-medium">{values[variable] || '-'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    formData.groups.map((group, index) => (
                      index === currentStep && (
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
                            {Object.keys(group.variables).map((variable) => (
                              <motion.div
                                key={variable}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100"
                              >
                                <Label htmlFor={variable} className="text-sm font-medium text-gray-700 block">
                                  {variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Label>
                                <Input
                                  id={variable}
                                  value={values[variable] || ''}
                                  onChange={(e) => setValues(prev => ({
                                    ...prev,
                                    [variable]: e.target.value
                                  }))}
                                  placeholder={`Ingrese ${variable.toLowerCase()}`}
                                  className="w-full bg-white"
                                  required
                                />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    ))
                  )}
                </AnimatePresence>
              </form>
            </CardContent>

            {/* Fixed Navigation Footer */}
            <div className="border-t px-6 py-4 bg-white">
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Paso {currentStep + 1} de {totalSteps}
                  </span>
                  {!isConfirmationStep ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      form="procedureForm"
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 min-w-[160px] justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="w-4 h-4" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Confirmar y Enviar
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Confirmación de envío</DialogTitle>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">
                ¡Gracias por tu información!
              </h3>
              <p className="text-gray-500">
                Tu formulario ha sido enviado correctamente
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Spinner className="w-4 h-4" />
              Redirigiendo en unos segundos...
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Spinner className="w-6 h-6" />
            <span className="text-gray-700">Enviando formulario...</span>
          </div>
        </div>
      )}
    </>
  )
} 