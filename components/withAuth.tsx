"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const router = useRouter()
    const { isLoggedIn, isAuthLoading } = useAuth()

    useEffect(() => {
      // Vérifier si l'utilisateur est connecté seulement quand l'authentification n'est plus en cours de chargement
      if (!isAuthLoading && !isLoggedIn) {
        console.log("withAuth - Redirection vers login") // Débogage
        router.push("/client/auth/login")
      }
    }, [isLoggedIn, isAuthLoading, router])

    // Afficher un état de chargement pendant la vérification
    if (isAuthLoading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          <p className="ml-3">Vérification de l&aposauthentification...</p>
        </div>
      )
    }

    // Si l'utilisateur est connecté, afficher le composant
    if (isLoggedIn) {
      return <WrappedComponent {...props} />
    }

    // Si l'authentification est terminée et l'utilisateur n'est pas connecté,
    // on peut retourner null car la redirection est gérée dans l'useEffect
    return null
  }
}

