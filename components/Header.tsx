'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, BookOpen, FileText } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl">Menteronics</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/tutorials"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-accent ${
                pathname?.startsWith('/tutorials') ? 'text-accent' : 'text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tutorials</span>
            </Link>
            <Link
              href="/blog"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-accent ${
                pathname?.startsWith('/blog') ? 'text-accent' : 'text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blog</span>
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-48 sm:w-64 pl-10 pr-4 py-2 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
