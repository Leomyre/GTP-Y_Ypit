"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Compass, Star, User } from "lucide-react"

const NavbarClients = () => {
  const pathname = usePathname()

  const navItems = [
    { name: "Accueil", href: "/client/acceuil", icon: Home },
    { name: "Voyages Populaires", href: "/client/voyages-populaires", icon: Compass },
    { name: "Voyages Recommandés", href: "/client/voyages-recommandes", icon: Star },
    { name: "Mon Profil", href: "/client/profil", icon: User },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/clients/accueil" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Agence de Voyage
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            <div className="md:hidden ml-4">
              <Button variant="outline" size="icon">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavbarClients

