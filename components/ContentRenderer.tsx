'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { ContentBlock, StructuredContent } from '@/lib/content-types'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'

interface ContentRendererProps {
  content: StructuredContent
}

export function ContentRenderer({ content }: ContentRendererProps) {
  useEffect(() => {
    Prism.highlightAll()
  }, [content])

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return renderHeading(block, index)
      case 'paragraph':
        return renderParagraph(block, index)
      case 'image':
        return renderImage(block, index)
      case 'code':
        return renderCode(block, index)
      case 'list':
        return renderList(block, index)
      case 'table':
        return renderTable(block, index)
      default:
        return null
    }
  }

  const renderHeading = (block: Extract<ContentBlock, { type: 'heading' }>, index: number) => {
    const headingTags = {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'h4',
      5: 'h5',
      6: 'h6',
    } as const
    
    const TagName = headingTags[block.level]
    const className = getHeadingClassName(block.level)
    const id = block.content.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    return (
      <TagName key={index} id={id} className={className}>
        {block.content}
      </TagName>
    )
  }

  const getHeadingClassName = (level: number): string => {
    const baseClasses = 'font-bold scroll-mt-24'
    switch (level) {
      case 1:
        return `${baseClasses} text-4xl mb-6 mt-8`
      case 2:
        return `${baseClasses} text-3xl mb-5 mt-7 pb-2 border-b-2 border-accent`
      case 3:
        return `${baseClasses} text-2xl mb-4 mt-6`
      case 4:
        return `${baseClasses} text-xl mb-3 mt-5`
      case 5:
        return `${baseClasses} text-lg mb-3 mt-4`
      case 6:
        return `${baseClasses} text-base mb-2 mt-4`
      default:
        return baseClasses
    }
  }

  const renderParagraph = (block: Extract<ContentBlock, { type: 'paragraph' }>, index: number) => {
    return (
      <p key={index} className="text-base leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderInlineFormatting(block.content) }} />
    )
  }

  const renderInlineFormatting = (text: string): string => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code (escape HTML entities inside code)
    text = text.replace(/`(.+?)`/g, (match, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<code class="inline-code">${escaped}</code>`
    })
    // Links
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent hover:text-accent-dark underline">$1</a>')
    return text
  }

  const renderImage = (block: Extract<ContentBlock, { type: 'image' }>, index: number) => {
    return (
      <figure key={index} className="my-8 flex flex-col items-center" suppressHydrationWarning>
        <div className="relative max-w-xl w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src={block.url}
            alt={block.alt}
            width={128}
            height={128}
            className="w-full h-auto object-contain"
            priority={index === 0}
            quality={100}
          />
        </div>
        {block.caption && (
          <figcaption className="text-sm text-gray-600 text-center mt-3 italic max-w-2xl">
            {block.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  const renderCode = (block: Extract<ContentBlock, { type: 'code' }>, index: number) => {
    const language = block.language || 'text'
    
    return (
      <div key={index} className="my-6">
        {block.filename && (
          <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm font-mono flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {block.filename}
          </div>
        )}
        <pre 
          className={`${!block.filename ? 'rounded-lg' : 'rounded-b-lg'} overflow-x-auto`}
          suppressHydrationWarning
        >
          <code 
            className={`language-${language}`}
            suppressHydrationWarning
          >
            {block.content}
          </code>
        </pre>
      </div>
    )
  }

  const renderList = (block: Extract<ContentBlock, { type: 'list' }>, index: number) => {
    const ListTag = block.ordered ? 'ol' : 'ul'
    const listClass = block.ordered 
      ? 'list-decimal list-inside space-y-2 mb-4 ml-4'
      : 'list-disc list-inside space-y-2 mb-4 ml-4'

    return (
      <ListTag key={index} className={listClass}>
        {block.items.map((item, i) => (
          <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInlineFormatting(item) }} />
        ))}
      </ListTag>
    )
  }

  const renderTable = (block: Extract<ContentBlock, { type: 'table' }>, index: number) => {
    return (
      <div key={index} className="my-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {block.headers.map((header, i) => (
                <th key={i} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-300 px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
