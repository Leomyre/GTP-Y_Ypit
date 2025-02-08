"use client"

import { ThemeProvider } from "@/components/theme-provider"
import NavbarResponsable from "@/components/NavbarResponsable"
import { useState, useEffect } from "react"
import type React from "react" // Added import for React

export default function ResponsableTourLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <NavbarResponsable />
        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>
    </ThemeProvider>
  )
}

