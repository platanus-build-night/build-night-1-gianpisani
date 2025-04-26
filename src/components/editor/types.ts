export interface Variable {
  name: string
  value?: string
}

export interface FormGroup {
  id: string
  name: string
  description: string
  variables: string[]
}

export interface FormConfig {
  groups: FormGroup[]
} 