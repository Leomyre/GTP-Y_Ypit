"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { name: 'Acceuil' , href: '/client/acceuil' },
  { name: 'Réservations', href: '/client/tour/reservations' },
  { name: 'Destinations', href: '/client/tour/destinations' },
  { name: 'Clients', href: '/client/tour/clients' },
  { name: 'Finances', href: '/client/tour/finances' },
]

const NavbarClients = () => {
  const pathname = usePathname()
  const [showNav, setShowNav] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Navigation Desktop (Toujours visible) */}
      <nav className="hidden sm:flex sm:flex-col w-64 bg-white shadow-lg fixed h-full p-4">
        <h1 className="text-2xl font-bold text-gray-800">Agence de Voyage</h1>
        <ul className="space-y-2 py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <span className={`block px-4 py-2 text-sm ${
                  pathname === item.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contenu principal (décalé à droite sur desktop) */}
      <main className="flex-1 sm:ml-64">
        {/* Bouton Hamburger (Visible en mobile uniquement) */}
        <div className="sm:hidden flex justify-between items-center p-4 bg-white shadow-md fixed w-full top-0 z-50">
          <h1 className="text-xl font-bold text-gray-800">Agence de Voyage</h1>
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setShowNav(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Menu Mobile (Overlay + Barre latérale) */}
        {showNav && (
          <div className="fixed inset-0 z-50">
            {/* Fond semi-transparent */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowNav(false)} // Ferme le menu en cliquant à l'extérieur
            ></div>

            {/* Menu latéral mobile */}
            <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4 z-50">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Menu</h1>
                <button
                  className="text-gray-700 focus:outline-none"
                  onClick={() => setShowNav(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} onClick={() => setShowNav(false)}>
                      <span className={`block px-4 py-2 text-sm ${
                        pathname === item.href
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </main>
    </div>
  )
}

export default NavbarClients
