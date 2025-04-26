'use client'

import React from 'react'
import { Node, mergeAttributes } from '@tiptap/core'

export const VariableNode = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: node => {
          const text = (node as HTMLElement).textContent
          const match = text?.match(/{{(.+?)}}/)
          if (match) {
            return { name: match[1] }
          }
          return false
        }
      }
    ]
  },

  renderHTML({ node }) {
    return ['span', { class: 'text-blue-600 font-medium' }, `{{${node.attrs.name}}}`]
  },
}) 