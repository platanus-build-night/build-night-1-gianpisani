import { notFound } from 'next/navigation'
import DocumentEditor from '@/components/editor/DocumentEditor'
import { getDocument } from '@/lib/supabase'

export default async function DocumentPage({ params }: { params: { id: string } }) {
  let document
  
  try {
    if (params.id === 'new') {
      document = null
    } else {
      document = await getDocument(params.id)
      if (!document) notFound()
    }
  } catch (error) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
        
      <DocumentEditor initialDocument={document} />
    </div>
  )
} 