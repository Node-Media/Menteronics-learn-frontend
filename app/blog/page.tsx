import Link from 'next/link'
import { FileText, Clock, Calendar, ChevronRight } from 'lucide-react'
import type { Blog } from '@/lib/content-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/blogs?where[isPublished][equals]=true&sort=-updatedAt`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    )
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs()

  // Helper to calculate reading time from content
  const getReadingTime = (content: any[]): number => {
    const wordCount = JSON.stringify(content).split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-700">
              Insights, tips, and thoughts on software development
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts List */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No blog posts available yet.
              </p>
              <p className="text-gray-500">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {blogs.map((blog) => {
                const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
                const readingTime = getReadingTime(blog.content)

                return (
                  <article 
                    key={blog.id}
                    className="card group hover:border-accent hover:shadow-lg transition-all"
                  >
                    <Link href={`/blog/${blog.slug}`} className="block">
                      <h2 className="text-3xl font-bold mb-3 group-hover:text-accent transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4 text-lg">
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
                        <div className="ml-auto flex items-center text-accent font-medium group-hover:text-accent-dark">
                          <span>Read more</span>
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
