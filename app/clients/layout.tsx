import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import AnimatedBackground from "@/components/AnimatedBackground"
import Link from "next/link"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen relative">
        <AnimatedBackground />
        <header className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
            <Link href="/client/accueil" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Agence de Voyage en Ligne
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/client/accueil" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                Accueil
              </Link>
              <Link href="/client/voyages" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                Voyages
              </Link>
              <Link href="/client/contact" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">
                Contact
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg p-6 shadow-lg">{children}</div>
        </main>
        <footer className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-blue-600 dark:text-blue-400">
            © 2024 Agence de Voyage en Ligne. Tous droits réservés.
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

