"use client"

import { ThemeProvider } from "@/components/theme-provider"
import NavbarResponsable from "@/components/NavbarResponsable"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import type React from "react"

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAuthLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/responsable/auth/login") // Redirige s'il n'est pas connecté
    }
  }, [isLoggedIn, isAuthLoading, router])

  if (isAuthLoading) {
    // Tu peux customiser le loader ici si tu veux
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-bold">Chargement...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // On ne montre rien tant qu'on n'est pas sûr
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <NavbarResponsable />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

export default function ResponsableTourLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ProtectedLayout>{children}</ProtectedLayout>
      </AuthProvider>
    </ThemeProvider>
  )
}
