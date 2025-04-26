import { notFound } from 'next/navigation'
import DocumentEditor from '@/components/editor/DocumentEditor'
import { getDocument } from '@/lib/supabase'

// @ts-ignore
export default async function DocumentPage({ params }: any) {
  let document

  try {
    const id = params.id
    if (id === 'new') {
      document = null
    } else {
      document = await getDocument(id)
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