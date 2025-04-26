import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface Document {
  id: string
  name: string
  content: string
  form_config: {
    groups: {
      id: string
      title: string
      description: string
      variables: string[]
    }[]
  }
  created_at: string
  updated_at: string
}

export interface Procedure {
  id: string
  document_id: string
  form_data: {
    variables: Record<string, string>
  }
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: Document
        Insert: Omit<Document, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at'>>
      }
      procedures: {
        Row: Procedure
        Insert: Omit<Procedure, 'id' | 'created_at'>
        Update: Partial<Omit<Procedure, 'id' | 'created_at'>>
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export async function saveDocument(name: string, content: string, formConfig: Document['form_config']) {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      name,
      content,
      form_config: formConfig
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function saveProcedure(documentId: string, formData: Procedure['form_data']) {
  const { data, error } = await supabase
    .from('procedures')
    .insert({
      document_id: documentId,
      form_data: formData
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDocument(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select()
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getProcedures(documentId: string) {
  const { data, error } = await supabase
    .from('procedures')
    .select()
    .eq('document_id', documentId)

  if (error) throw error
  return data
} 