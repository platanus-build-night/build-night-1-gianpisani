import { Document, Procedure, FormGroup } from '@/app/types'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

const handlePDFDownload = async (content: string, fileName: string) => {
    // Crear un iframe aislado para el PDF
    const iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.style.position = 'fixed'
    iframe.style.left = '-9999px'
    document.body.appendChild(iframe)

    // Asegurarnos de que el iframe está listo
    await new Promise(resolve => {
        iframe.onload = resolve
        
        // Escribir el contenido en el iframe
        const doc = iframe.contentDocument
        if (!doc) throw new Error('No se pudo acceder al documento del iframe')
        
        doc.open()
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                body {
                    margin: 0;
                    padding: 40px;
                    background: #FFFFFF;
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    width: 800px;
                }
                h1 { font-size: 24px; margin-bottom: 16px; color: #000000; }
                h2 { font-size: 20px; margin-bottom: 14px; color: #000000; }
                h3 { font-size: 18px; margin-bottom: 12px; color: #000000; }
                p { margin-bottom: 12px; }
                ul, ol { margin-bottom: 12px; padding-left: 24px; }
                li { margin-bottom: 6px; }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `)
        doc.close()
    })

    try {
        // Convertir el HTML a canvas
        const canvas = await html2canvas(iframe.contentDocument!.body, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF'
        })

        // Crear PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        // Configurar márgenes y tamaño
        const imgWidth = 210 - 40 // A4 - márgenes
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const marginX = 20
        const marginY = 20

        // Agregar imagen del contenido
        pdf.addImage(
            canvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            marginX,
            marginY,
            imgWidth,
            imgHeight
        )

        // Agregar números de página
        const pageCount = pdf.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i)
            pdf.setFontSize(10)
            pdf.setTextColor(128)
            pdf.text(
            `Página ${i} de ${pageCount}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: 'center' }
            )
        }

        // Descargar PDF
        pdf.save(`${fileName}.pdf`)
    } finally {
        // Limpiar el iframe
        document.body.removeChild(iframe)
    }
}

const handleWordDownload = async (content: string, fileName: string) => {
    // Convertir el HTML en elementos de docx
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content

    const docxElements: Paragraph[] = []
    
    // Función recursiva para procesar nodos
    const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            return new Paragraph({
                children: [new TextRun(node.textContent.trim())],
                spacing: { after: 200 }
            })
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            const text = element.textContent?.trim()
            
            if (!text) return null

            switch (element.tagName.toLowerCase()) {
                case 'h1':
                    return new Paragraph({
                        text,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 400, after: 200 }
                    })
                case 'h2':
                    return new Paragraph({
                        text,
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 200 }
                    })
                case 'h3':
                    return new Paragraph({
                        text,
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200, after: 200 }
                    })
                case 'p':
                    return new Paragraph({
                        children: [new TextRun(text)],
                        spacing: { after: 200 }
                    })
                case 'ul':
                case 'ol':
                    return Array.from(element.children).map(li => 
                        new Paragraph({
                            children: [new TextRun(`• ${li.textContent?.trim()}`)],
                            spacing: { before: 100, after: 100 },
                            indent: { left: 720 } // 0.5 pulgadas
                        })
                    )
                default:
                    if (text) {
                        return new Paragraph({
                            children: [new TextRun(text)],
                            spacing: { after: 200 }
                        })
                    }
            }
        }
        return null
    }

    // Procesar todos los nodos
    const processNodes = (nodes: NodeListOf<ChildNode>) => {
        nodes.forEach(node => {
            const result = processNode(node)
            if (result) {
                if (Array.isArray(result)) {
                    docxElements.push(...result)
                } else {
                    docxElements.push(result)
                }
            }
        })
    }

    processNodes(tempDiv.childNodes)

    // Crear el documento
    const doc = new DocxDocument({
        sections: [{
            properties: {},
            children: docxElements
        }]
    })

    // Generar el archivo
    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.docx`
    link.click()
    window.URL.revokeObjectURL(url)
}

export const handleDownload = async (procedure: Procedure, type: 'PDF' | 'WORD') => {
    try {
        const { data, error: docError } = await supabase
        .from('documents')
        .select('content, name')
        .eq('id', procedure.document_id)
        .single()

        if (docError || !data?.content) {
        toast.error('Error al cargar el documento')
        return
        }

        // Procesar el contenido reemplazando las variables con sus valores
        let content = data.content
        procedure.form_data.groups.forEach((group: FormGroup) => {
        Object.entries(group.variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            content = content.replace(regex, value || `[${key}]`)
        })
        })

        if (type === 'PDF') {
            await handlePDFDownload(content, data.name || 'documento')
        } else {
            await handleWordDownload(content, data.name || 'documento')
        }

        toast.success('Documento descargado correctamente')
    } catch (error) {
        console.error('Error:', error)
        toast.error('Error al descargar el documento')
    }
}