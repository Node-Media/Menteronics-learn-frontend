import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ChevronLeft, Calendar } from 'lucide-react'
import { ContentRenderer } from '@/components/ContentRenderer'
import type { Tutorial } from '@/lib/content-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

async function getTutorial(categorySlug: string, tutorialSlug: string): Promise<Tutorial | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/tutorials?where[slug][equals]=${tutorialSlug}&where[isPublished][equals]=true&depth=1`,
      { next: { revalidate: 0 } } // No cache during development
    )
    
    if (!res.ok) return null
    
    const data = await res.json()
    const tutorial = data.docs?.[0]
    
    // Verify the tutorial belongs to the correct category
    if (tutorial && typeof tutorial.category === 'object' && tutorial.category.slug === categorySlug) {
      return tutorial
    }
    
    return null
  } catch (error) {
    console.error('Error fetching tutorial:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{
    categorySlug: string
    tutorialSlug: string
  }>
}

export default async function TutorialPage({ params }: PageProps) {
  const { categorySlug, tutorialSlug } = await params
  const tutorial = await getTutorial(categorySlug, tutorialSlug)

  if (!tutorial) {
    notFound()
  }

  const category = typeof tutorial.category === 'object' ? tutorial.category : null
  const formattedDate = new Date(tutorial.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link 
              href="/tutorials"
              className="text-gray-600 hover:text-accent transition-colors"
            >
              Tutorials
            </Link>
            <span className="text-gray-400">/</span>
            {category && (
              <>
                <Link 
                  href={`/tutorials/${categorySlug}`}
                  className="text-gray-600 hover:text-accent transition-colors"
                >
                  {category.name}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{tutorial.title}</span>
          </nav>

          {/* Back Link */}
          <Link 
            href={`/tutorials/${categorySlug}`}
            className="inline-flex items-center text-accent hover:text-accent-dark mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Back to {category?.name || 'Category'}</span>
          </Link>

          {/* Title and Meta */}
          <header className="mb-12 pb-8 border-b-2 border-gray-200">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {tutorial.title}
            </h1>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {tutorial.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {tutorial.readingTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{tutorial.readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Updated {formattedDate}</span>
              </div>
              {category && (
                <Link 
                  href={`/tutorials/${categorySlug}`}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full font-medium hover:bg-accent/20 transition-colors"
                >
                  {category.name}
                </Link>
              )}
            </div>
          </header>

          {/* Tutorial Content */}
          <div className="mb-16">
            <ContentRenderer content={tutorial.content} />
          </div>

          {/* Back to Category */}
          <div className="pt-8 border-t border-gray-200">
            <Link 
              href={`/tutorials/${categorySlug}`}
              className="btn-secondary inline-block"
            >
              <ChevronLeft className="w-4 h-4 inline mr-2" />
              Back to {category?.name || 'Category'}
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug, tutorialSlug } = await params
  const tutorial = await getTutorial(categorySlug, tutorialSlug)

  if (!tutorial) {
    return {
      title: 'Tutorial Not Found'
    }
  }

  return {
    title: `${tutorial.title} | Menteronics`,
    description: tutorial.summary,
  }
}
