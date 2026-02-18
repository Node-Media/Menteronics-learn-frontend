import Link from 'next/link'
import { Home, BookOpen, FileText } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-accent">404</span>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary text-center flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link href="/tutorials" className="btn-secondary text-center flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Browse Tutorials
          </Link>
          <Link href="/blog" className="btn-secondary text-center flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Read Blog
          </Link>
        </div>
      </div>
    </main>
  )
}
