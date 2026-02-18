'use client'

import { useEffect } from 'react'

export function ConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalLog = console.log
      const originalInfo = console.info
      const originalWarn = console.warn

      // Filter patterns for unwanted messages
      const filterPatterns = [
        /fast refresh/i,
        /webpack compiled/i,
        /hmr/i,
        /hot update/i,
      ]

      const shouldFilter = (args: any[]): boolean => {
        const message = args.join(' ')
        return filterPatterns.some(pattern => pattern.test(message))
      }

      console.log = (...args: any[]) => {
        if (!shouldFilter(args)) originalLog.apply(console, args)
      }

      console.info = (...args: any[]) => {
        if (!shouldFilter(args)) originalInfo.apply(console, args)
      }

      console.warn = (...args: any[]) => {
        if (!shouldFilter(args)) originalWarn.apply(console, args)
      }

      return () => {
        console.log = originalLog
        console.info = originalInfo
        console.warn = originalWarn
      }
    }
  }, [])

  return null
}
