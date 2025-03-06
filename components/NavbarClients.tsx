"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/SearchBar"
import { Home, Compass, Star, User, Menu } from "lucide-react"
import { useState } from "react"

const NavbarClients = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Accueil", href: "/client/accueil", icon: Home },
    { name: "Populaires", href: "/client/voyages-populaires", icon: Compass },
    { name: "Recommandés", href: "/client/voyages-recommandes", icon: Star },
    { name: "Profil", href: "/client/profil", icon: User },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/client/accueil" className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            Agence de Voyage
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-teal-100"
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
            <Button variant="outline" size="icon" className="ml-4 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-3 py-2">
              <SearchBar />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-teal-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavbarClients

