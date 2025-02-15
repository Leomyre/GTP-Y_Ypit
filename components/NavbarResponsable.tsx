"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Map, Users, CreditCard, Menu, X, Plane, BookOpen, Route } from "lucide-react"

const navItems = [
  { name: "Tableau de bord", href: "/responsable/tour/dashboard", icon: Home },
  { name: "Voyages", href: "/responsable/tour/voyages", icon: Plane },
  { name: "Trajets", href: "/responsable/tour/trajets", icon: Route },
  { name: "Réservations", href: "/responsable/tour/reservations", icon: BookOpen },
  { name: "Destinations", href: "/responsable/tour/destinations", icon: Map },
  { name: "Clients", href: "/responsable/tour/clients", icon: Users },
  { name: "Finances", href: "/responsable/tour/finances", icon: CreditCard },
]

const NavbarResponsable = () => {
  const pathname = usePathname()
  const [showNav, setShowNav] = useState(false)

  const NavLinks = () => (
    <ul className="space-y-2">
      {navItems.map((item) => (
        <li key={item.name}>
          <Link href={item.href} onClick={() => setShowNav(false)}>
            <span
              className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Desktop */}
      <nav className="hidden sm:flex sm:flex-col w-64 bg-white dark:bg-gray-800 shadow-lg fixed h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Agence de Voyage</h1>
          <ThemeToggle />
        </div>
        <NavLinks />
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 sm:ml-64">
        {/* Header Mobile */}
        <div className="sm:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-50">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Agence de Voyage</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button className="text-gray-700 dark:text-gray-200 focus:outline-none" onClick={() => setShowNav(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Menu Mobile (Overlay + Barre latérale) */}
        {showNav && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowNav(false)}
            ></div>

            <nav className="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 transform transition-transform duration-200 ease-in-out">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Menu</h1>
                <button
                  className="text-gray-700 dark:text-gray-200 focus:outline-none"
                  onClick={() => setShowNav(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <NavLinks />
            </nav>
          </div>
        )}
      </main>
    </div>
  )
}

export default NavbarResponsable

