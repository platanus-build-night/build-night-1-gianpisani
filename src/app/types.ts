export interface Document {
    id: string
    name: string
    content: string
    user_id: string
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
        status: string
    }>
}

export interface FormGroup {
    id: string
    name: string
    variables: Record<string, string>
    description: string
}

export interface Procedure {
    id: string
    document_id: string
    nombre_cliente: string
    created_at: string
    status: string
    form_data: {
        groups: FormGroup[]
    }
}