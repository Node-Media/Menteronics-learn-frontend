import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ChevronLeft, Calendar } from 'lucide-react'
import { ContentRenderer } from '@/components/ContentRenderer'
import type { Blog } from '@/lib/content-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/blogs?where[slug][equals]=${slug}&where[isPublished][equals]=true`,
      { next: { revalidate: 0 } } // No cache during development
    )
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Calculate reading time
  const getReadingTime = (content: any[]): number => {
    const wordCount = JSON.stringify(content).split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }
  const readingTime = getReadingTime(blog.content)

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link 
              href="/blog"
              className="text-gray-600 hover:text-accent transition-colors"
            >
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{blog.title}</span>
          </nav>

          {/* Back Link */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-accent hover:text-accent-dark mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Back to Blog</span>
          </Link>

          {/* Title and Meta */}
          <header className="mb-12 pb-8 border-b-2 border-gray-200">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {blog.title}
            </h1>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {blog.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </header>

          {/* Blog Content */}
          <div className="mb-16">
            <ContentRenderer content={blog.content} />
          </div>

          {/* Back to Blog */}
          <div className="pt-8 border-t border-gray-200">
            <Link 
              href="/blog"
              className="btn-secondary inline-block"
            >
              <ChevronLeft className="w-4 h-4 inline mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found'
    }
  }

  return {
    title: `${blog.title} | Menteronics Blog`,
    description: blog.summary,
  }
}
