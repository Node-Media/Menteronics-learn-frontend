'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import type { StructuredContent } from '@/lib/content-types'

interface Section {
  id: string
  title: string
  level: number
}

interface TutorialSectionNavProps {
  content: StructuredContent
}

export function TutorialSectionNav({ content }: TutorialSectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const ticking = useRef(false)

  // Extract sections from content (memoized to prevent recalculation)
  const sections = useMemo(() => {
    const headings = content.filter(
      (block) => block.type === 'heading' && (block.level === 2 || block.level === 3)
    ) as Extract<typeof content[number], { type: 'heading' }>[]

    return headings.map((heading) => ({
      id: heading.content.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: heading.content,
      level: heading.level,
    }))
  }, [content])

  // Only render if there are at least 2 sections
  if (sections.length < 2) {
    return null
  }

  useEffect(() => {
    const getActiveSection = () => {
      // Get viewport center point
      const scrollPosition = window.scrollY + window.innerHeight * 0.3

      // Find all section positions
      const sectionPositions = sections.map((section) => {
        const element = document.getElementById(section.id)
        if (!element) return { id: section.id, top: Infinity }
        
        const top = element.offsetTop
        return { id: section.id, top }
      })

      // Find the active section (last section whose top is above scroll position)
      let active = sectionPositions[0].id
      
      for (const section of sectionPositions) {
        if (section.top <= scrollPosition) {
          active = section.id
        } else {
          break
        }
      }

      return active
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const active = getActiveSection()
          setActiveSection(active)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // Set initial active section
    setActiveSection(getActiveSection())

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:block z-30">
      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className="group relative flex items-center justify-end cursor-pointer py-2"
            aria-label={`Navigate to ${section.title}`}
          >
            {/* Indicator */}
            <div
              className={`h-0.5 transition-all duration-300 ${
                activeSection === section.id
                  ? 'w-8 bg-accent'
                  : 'w-4 bg-gray-300 group-hover:w-6 group-hover:bg-accent-light'
              } ${section.level === 3 ? 'opacity-60' : ''}`}
            />
            
            {/* Tooltip */}
            <span
              className={`absolute right-10 whitespace-nowrap px-3 py-1.5 rounded-md font-medium transition-all duration-200 pointer-events-none
                ${section.level === 3 ? 'text-sm' : 'text-base'}
                ${activeSection === section.id ? 'bg-accent text-white' : 'bg-gray-800 text-white'}
                opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
              `}
            >
              {section.title}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
