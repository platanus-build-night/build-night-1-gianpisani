export interface FormGroup {
  id: string
  name: string
  description?: string
  variables: string[] // IDs of variables in this group
} 