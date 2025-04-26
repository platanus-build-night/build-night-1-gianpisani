import { Node } from '@tiptap/react'

export const VariableNode = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
      },
    ]
  },

  renderHTML({ node }) {
    return ['span', {
      'data-type': 'variable',
      'class': 'bg-blue-100 text-blue-800 rounded-xl px-2 py-1 inline-flex items-center gap-1 group relative',
      'data-name': node.attrs.name,
    }, `{{${node.attrs.name}}}`]
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('span')
      const name = node.attrs.name

      dom.setAttribute('data-type', 'variable')
      dom.classList.add(
        'bg-blue-100',
        'text-blue-800',
        'rounded-xl',
        'px-2',
        'py-1',
        'inline-flex',
        'items-center',
        'gap-1',
        'group',
        'relative'
      )

      const variableContent = document.createElement('span')
      variableContent.textContent = `{{${name}}}`
      dom.appendChild(variableContent)

      // Botón de eliminar
      const deleteButton = document.createElement('button')
      deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`
      deleteButton.classList.add(
        'opacity-0',
        'group-hover:opacity-100',
        'absolute',
        '-top-2',
        '-right-2',
        'bg-white',
        'rounded-full',
        'p-1',
        'hover:bg-red-50',
        'text-red-500',
        'shadow-sm',
        'border',
        'border-red-200',
        'transition-opacity'
      )
      
      if (typeof getPos === 'function') {
        deleteButton.addEventListener('click', () => {
          editor.commands.deleteRange({ from: getPos(), to: getPos() + node.nodeSize })
        })
      }
      
      dom.appendChild(deleteButton)

      return {
        dom,
        destroy: () => {
          deleteButton.removeEventListener('click', () => {})
        },
      }
    }
  },
}) 