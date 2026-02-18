'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Tutorial, Category } from '@/lib/content-types'

interface TutorialSideNavProps {
  tutorials: Tutorial[]
  currentTutorialSlug: string
  categorySlug: string
  category: Category | null
  currentTitle: string
}

export function TutorialSideNav({ tutorials, currentTutorialSlug, categorySlug, category, currentTitle }: TutorialSideNavProps) {
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Find the footer element
    const footer = document.querySelector('footer')
    if (!footer) return

    // Create intersection observer to watch footer
    const observer = new IntersectionObserver(
      (entries) => {
        const footerEntry = entries[0]
        setIsFooterVisible(footerEntry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    )

    observerRef.current = observer
    observer.observe(footer)

    // Cleanup on unmount
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <nav 
      className={`
        w-80 h-[calc(100vh-5rem)] bg-white rounded-lg border-2 border-accent/20 shadow-lg overflow-hidden flex flex-col transition-all duration-300
        ${isFooterVisible ? 'absolute bottom-0' : 'fixed top-20'}
      `}
    >
      {/* Fixed Breadcrumb - Always visible at top */}
      <div className="p-6 pb-4 border-b-2 border-accent/20 shrink-0">
        <nav className="flex items-center gap-2 text-sm">
          <Link 
            href="/tutorials"
            className="text-gray-600 hover:text-accent transition-colors font-medium"
          >
            Tutorials
          </Link>
          <span className="text-accent">/</span>
          {category && (
            <>
              <Link 
                href={`/tutorials/${categorySlug}`}
                className="text-accent hover:text-accent-dark transition-colors font-medium"
              >
                {category.name}
              </Link>
              <span className="text-accent">/</span>
            </>
          )}
          <span className="text-gray-900 font-semibold text-xs truncate">{currentTitle}</span>
        </nav>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 bg-gray-50 custom-scrollbar">
        <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-accent rounded-full"></span>
          Course Contents
        </h3>
        <div className="space-y-2">
          {tutorials.map((tutorial) => {
            const isActive = tutorial.slug === currentTutorialSlug
            const isCompleted = false // TODO: Track completed tutorials
            
            return (
              <Link
                key={tutorial.id}
                href={`/tutorials/${categorySlug}/${tutorial.slug}`}
                className={`
                  block p-3 rounded-lg transition-all group
                  ${isActive 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span 
                    className={`
                      shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${isActive 
                        ? 'bg-white text-accent' 
                        : 'bg-gray-200 text-gray-600 group-hover:bg-accent group-hover:text-white'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : tutorial.order}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {tutorial.title}
                    </p>
                    {tutorial.readingTime && (
                      <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {tutorial.readingTime} min
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
