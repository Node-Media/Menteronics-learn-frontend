import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import type { Category } from '@/lib/content-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      next: { revalidate: 0 } // No cache during development
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function TutorialsPage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Browse Tutorials
            </h1>
            <p className="text-xl text-gray-700">
              Choose a technology to start learning
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No tutorial categories available yet.
            </p>
            <p className="text-gray-500">
              Check back soon for new content!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tutorials/${category.slug}`}
                className="card group hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                {category.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
