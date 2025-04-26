'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Button } from '../../ui/button'
import type { FormGroup } from '@/components/editor/types'

interface FormPreviewProps {
  groups: FormGroup[]
  onSubmit: (values: Record<string, string>) => void
}

export function FormPreview({ groups, onSubmit }: FormPreviewProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)

  const steps = groups.reduce<FormGroup[][]>((acc, group, index) => {
    const stepIndex = Math.floor(index / 3)
    if (!acc[stepIndex]) acc[stepIndex] = []
    acc[stepIndex].push(group)
    return acc
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formulario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps[step]?.map((group) => (
            <div key={group.id} className="space-y-2">
              <Label htmlFor={group.name} className="text-sm font-medium">
                {group.name}
              </Label>
              <div className="space-y-4">
                {group.variables.map((variable: string) => (
                  <div key={variable} className="space-y-2">
                    <Label htmlFor={variable} className="text-sm font-medium">
                      {variable}
                    </Label>
                    <Input
                      id={variable}
                      value={values[variable] || ''}
                      onChange={(e) => setValues(prev => ({
                        ...prev,
                        [variable]: e.target.value
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
          >
            Anterior
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
            >
              Siguiente
            </Button>
          ) : (
            <Button onClick={() => onSubmit(values)}>
              Finalizar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 