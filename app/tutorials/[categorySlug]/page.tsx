import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category, Tutorial } from '@/lib/content-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories?where[slug][equals]=${slug}`, {
      next: { revalidate: 0 } // 0 = no cache during development
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getTutorialsByCategory(categoryId: string): Promise<Tutorial[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/tutorials?where[category][equals]=${categoryId}&where[isPublished][equals]=true`,
      { next: { revalidate: 0 } } // 0 = no cache during development
    )
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching tutorials:', error)
    return []
  }
}

interface PageProps {
  params: Promise<{ categorySlug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params
  const category = await getCategory(categorySlug)

  if (!category) {
    notFound()
  }

  const tutorials = await getTutorialsByCategory(category.id)

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb and Header */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/tutorials"
              className="inline-flex items-center text-accent hover:text-accent-dark mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Back to Tutorials</span>
            </Link>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-gray-700">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tutorials List */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {tutorials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No tutorials available in this category yet.
              </p>
              <Link 
                href="/tutorials"
                className="text-accent hover:text-accent-dark font-medium"
              >
                Browse other categories
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {tutorials.map((tutorial, index) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${categorySlug}/${tutorial.slug}`}
                  className="card group hover:border-accent hover:shadow-lg transition-all block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-accent">
                          #{index + 1}
                        </span>
                        <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">
                          {tutorial.title}
                        </h2>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {tutorial.summary}
                      </p>
                      {tutorial.readingTime && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{tutorial.readingTime} min read</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
