'use client'

import { useEffect, useState, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface FormData {
  groups: {
    id: string
    name: string
    variables: Record<string, string>
    description: string
  }[]
}

export default function ProcedurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

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
    if (!formData) return

    try {
      // Actualizamos los valores en el formData
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
      
      toast.success('Formulario enviado correctamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar el formulario')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b bg-white">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Complete el Formulario
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {formData.groups.map((group) => (
                <div key={group.id} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                    {group.description && (
                      <p className="mt-1 text-sm text-gray-500">{group.description}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    {Object.keys(group.variables).map((variable) => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={variable} className="text-sm font-medium text-gray-700">
                          {variable}
                        </Label>
                        <Input
                          id={variable}
                          value={values[variable] || ''}
                          onChange={(e) => setValues(prev => ({
                            ...prev,
                            [variable]: e.target.value
                          }))}
                          placeholder={`Ingrese ${variable.toLowerCase()}`}
                          className="w-full"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Enviar Formulario
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 