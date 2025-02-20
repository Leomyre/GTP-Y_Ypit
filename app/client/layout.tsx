import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AnimatedBackground from "@/components/AnimatedBackground"
import NavbarClients from "@/components/NavbarClients"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen relative">
        <AnimatedBackground />
        <NavbarClients />
        <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 relative z-10">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-lg">
            {children}
          </div>
        </main>
        <footer className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t mt-8 sm:mt-12">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center text-sm sm:text-base text-blue-600 dark:text-blue-400">
            © 2024 Agence de Voyage en Ligne. Tous droits réservés.
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

