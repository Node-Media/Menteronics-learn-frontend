import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ChevronLeft, Calendar, ChevronRight } from 'lucide-react'
import { ContentRenderer } from '@/components/ContentRenderer'
import { TutorialSideNav } from '@/components/TutorialSideNav'
import { TutorialSectionNav } from '@/components/TutorialSectionNav'
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

async function getTutorialsByCategory(categoryId: string): Promise<Tutorial[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/tutorials?where[category][equals]=${categoryId}&where[isPublished][equals]=true&sort=order`,
      { next: { revalidate: 0 } }
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
  
  // Fetch all tutorials in the same category for side nav
  const allTutorials = category ? await getTutorialsByCategory(category.id) : []
  
  // Find current tutorial index and get previous/next tutorials
  const currentIndex = allTutorials.findIndex(t => t.slug === tutorialSlug)
  const previousTutorial = currentIndex > 0 ? allTutorials[currentIndex - 1] : null
  const nextTutorial = currentIndex < allTutorials.length - 1 ? allTutorials[currentIndex + 1] : null
  
  const formattedDate = new Date(tutorial.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="min-h-screen bg-white">
      {/* Section Navigator */}
      <TutorialSectionNav content={tutorial.content} />

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Two-column layout: Side Nav + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Navigation - Hidden on mobile, shown on large screens */}
          {allTutorials.length > 0 && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <TutorialSideNav 
                tutorials={allTutorials}
                currentTutorialSlug={tutorialSlug}
                categorySlug={categorySlug}
                category={category}
                currentTitle={tutorial.title}
              />
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
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

            {/* Chapter Navigation */}
            <div className="pt-8 border-t-2 border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                {/* Previous Chapter */}
                {previousTutorial ? (
                  <Link 
                    href={`/tutorials/${categorySlug}/${previousTutorial.slug}`}
                    className="flex-1 group"
                  >
                    <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-accent transition-colors">
                      <ChevronLeft className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Previous Chapter
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
                          {previousTutorial.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1"></div>
                )}

                {/* Next Chapter */}
                {nextTutorial ? (
                  <Link 
                    href={`/tutorials/${categorySlug}/${nextTutorial.slug}`}
                    className="flex-1 group"
                  >
                    <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-accent transition-colors">
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Next Chapter
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
                          {nextTutorial.title}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1"></div>
                )}
              </div>
            </div>
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
