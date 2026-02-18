// Structured Content Block Types for Tutorials and Blogs
// This mirrors the backend types for rendering

export type ContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'code'
  | 'link'
  | 'list'
  | 'table'

export interface BaseBlock {
  id?: string
  type: ContentBlockType
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  content: string
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph'
  content: string
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  url: string
  alt: string
  caption?: string
}

export interface CodeBlock extends BaseBlock {
  type: 'code'
  language: string
  content: string
  filename?: string
}

export interface LinkBlock extends BaseBlock {
  type: 'link'
  url: string
  text: string
}

export interface ListBlock extends BaseBlock {
  type: 'list'
  ordered: boolean
  items: string[]
}

export interface TableBlock extends BaseBlock {
  type: 'table'
  headers: string[]
  rows: string[][]
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | CodeBlock
  | LinkBlock
  | ListBlock
  | TableBlock

export type StructuredContent = ContentBlock[]

// Tutorial type from backend
export interface Tutorial {
  id: string
  title: string
  slug: string
  summary: string
  content: StructuredContent
  order: number
  readingTime?: number
  isPublished: boolean
  category: Category
  createdAt: string
  updatedAt: string
}

// Blog type from backend
export interface Blog {
  id: string
  title: string
  slug: string
  summary: string
  content: StructuredContent
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// Category type from backend
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Search result
export interface SearchResult {
  type: 'tutorial' | 'blog'
  id: string
  title: string
  slug: string
  summary: string
  category?: Category
}
