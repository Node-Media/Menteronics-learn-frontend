'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Clock, ChevronRight, Loader2 } from 'lucide-react'
import type { SearchResult } from '@/lib/content-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const performSearch = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        })
        
        if (!res.ok) {
          throw new Error(`Search failed with status: ${res.status}`)
        }

        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error('Search error:', err)
        setError(`Failed to perform search. Make sure the backend server is running on ${BACKEND_URL}`)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-8 h-8 text-accent" />
              <h1 className="text-3xl sm:text-4xl font-bold">
                Search Results
              </h1>
            </div>
            {query && (
              <p className="text-lg text-gray-700">
                {loading ? (
                  'Searching for...'
                ) : (
                  <>Found {results.length} result{results.length !== 1 ? 's' : ''} for </>
                )}
                <span className="font-semibold text-accent">"{query}"</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {!query || query.length < 2 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Enter a search query to find tutorials and blog posts
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Minimum 2 characters required
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <span className="ml-3 text-gray-600">Searching...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                No results found for "{query}"
              </p>
              <p className="text-gray-500 text-sm">
                Try different keywords or browse our{' '}
                <Link href="/tutorials" className="text-accent hover:text-accent-dark">
                  tutorials
                </Link>{' '}
                and{' '}
                <Link href="/blog" className="text-accent hover:text-accent-dark">
                  blog
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result) => {
                const isTutorial = result.type === 'tutorial'
                const href = isTutorial
                  ? `/tutorials/${result.category?.slug}/${result.slug}`
                  : `/blog/${result.slug}`

                return (
                  <Link
                    key={result.id}
                    href={href}
                    className="card group hover:border-accent hover:shadow-lg transition-all block"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                            isTutorial 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {isTutorial ? 'Tutorial' : 'Blog'}
                          </span>
                          {isTutorial && result.category && (
                            <span className="text-sm text-gray-600">
                              in {result.category.name}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {result.title}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                          {result.summary}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white">
        <section className="bg-gray-50 py-12 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-8 h-8 text-accent" />
                <h1 className="text-3xl sm:text-4xl font-bold">Search</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </section>
      </main>
    }>
      <SearchContent />
    </Suspense>
  )
}
