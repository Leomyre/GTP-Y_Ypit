"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { UrlConfig } from "@/utils/Config"

// Créer un contexte pour l'authentification
type AuthContextType = {
  isLoggedIn: boolean
  isAuthLoading: boolean
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<any>
  verifyEmail: (email: string, code: string) => Promise<any>
  updateProfile: (profileData: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}

// Provider d'authentification
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        console.log("Token trouvé:", token)

        if (!token) {
          console.log("Aucun token trouvé, déconnecté")
          setIsLoggedIn(false)
          setIsAuthLoading(false)
          return
        }

        // Vérifier si le token est valide en récupérant le profil utilisateur
        try {
          const response = await fetch(`${UrlConfig.apiBaseUrl}/accounts/profile/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setIsLoggedIn(true)
            console.log("Token valide, utilisateur connecté:", userData)
          } else {
            console.log("Token invalide, déconnecté")
            // Si le token n'est pas valide, essayer de le rafraîchir
            const refreshToken = localStorage.getItem("refreshToken")
            if (refreshToken) {
              try {
                // Endpoint pour rafraîchir le token (à adapter selon votre API)
                const refreshResponse = await fetch(`${UrlConfig.apiBaseUrl}/token/refresh/`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ refresh: refreshToken }),
                })

                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json()
                  localStorage.setItem("accessToken", refreshData.access)

                  // Récupérer le profil avec le nouveau token
                  const newProfileResponse = await fetch(`${UrlConfig.apiBaseUrl}/accounts/profile/`, {
                    headers: {
                      Authorization: `Bearer ${refreshData.access}`,
                    },
                  })

                  if (newProfileResponse.ok) {
                    const userData = await newProfileResponse.json()
                    setUser(userData)
                    setIsLoggedIn(true)
                    return
                  }
                } else {
                  // Attendre un court instant avant de déconnecter l'utilisateur
                  await new Promise((resolve) => setTimeout(resolve, 500))
                  localStorage.removeItem("accessToken")
                  localStorage.removeItem("refreshToken")
                  setIsLoggedIn(false)
                  setIsAuthLoading(false)
                  return
                }
              } catch (refreshError) {
                console.error("Erreur lors du rafraîchissement du token:", refreshError)
              }
            }

            // Si le rafraîchissement échoue, déconnecter l'utilisateur
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            setIsLoggedIn(false)
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
        setIsLoggedIn(false)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion avec:", email)

      const response = await fetch(`${UrlConfig.apiBaseUrl}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erreur de connexion:", errorData)
        throw new Error(errorData.detail || "Échec de la connexion")
      }

      const data = await response.json()
      console.log("Réponse de connexion:", data)

      // Stocker les tokens JWT
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)

      // Récupérer les informations du profil utilisateur
      const profileResponse = await fetch(`${UrlConfig.apiBaseUrl}/accounts/profile/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      })

      if (profileResponse.ok) {
        const userData = await profileResponse.json()
        setUser(userData)
      }

      setIsLoggedIn(true)

      // Rediriger vers la page d'accueil
      router.push("/client/accueil")
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setIsLoggedIn(false)
    setUser(null)
    router.push("/client/auth/login")
  }

  // Fonction d'inscription
  const register = async (userData: any) => {
    try {
      // Formatage exact des données selon le modèle CustomUser du backend
      const formattedData = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        password2: userData.password2, // Ajout du champ password2 requis
        user_type: userData.user_type, // Utiliser la valeur fournie
        gender: userData.gender || "",
        nationality: userData.nationality || "",
        age: userData.age || null,
        city: userData.city || "",
        country: userData.country || "",
        phone_number: userData.phone_number || "",
      }

      console.log("Données formatées pour l'inscription:", JSON.stringify(formattedData, null, 2))

      const response = await fetch(`${UrlConfig.apiBaseUrl}/accounts/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      // Capturer la réponse brute pour analyse
      const responseText = await response.text()
      console.log("Réponse brute du serveur:", responseText)

      // Tenter de parser la réponse en JSON
      let data
      try {
        data = responseText ? JSON.parse(responseText) : {}
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e)
        data = { detail: "Format de réponse invalide" }
      }

      // Vérifier si la réponse est un succès
      if (!response.ok) {
        console.error("Erreur d'inscription - Statut:", response.status)
        console.error("Détails de l'erreur:", data)

        // Construire un message d'erreur détaillé
        let errorMessage = "Échec de l'inscription"

        if (typeof data === "object" && data !== null) {
          // Parcourir tous les champs d'erreur possibles
          const errorFields = [
            "email",
            "username",
            "password",
            "password2",
            "user_type",
            "phone_number",
            "detail",
            "non_field_errors",
          ]

          for (const field of errorFields) {
            if (data[field]) {
              const fieldError = Array.isArray(data[field]) ? data[field].join(", ") : data[field]
              errorMessage = `${field}: ${fieldError}`
              break
            }
          }
        }

        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error("Erreur complète lors de l'inscription:", error)
      throw error
    }
  }

  // Fonction de vérification d'email
  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await fetch(`${UrlConfig.apiBaseUrl}/accounts/verify-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Échec de la vérification de l'email")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Erreur de vérification de l'email:", error)
      throw error
    }
  }

  // Fonction de mise à jour du profil
  const updateProfile = async (profileData: any) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Non authentifié")
      }

      const response = await fetch(`${UrlConfig.apiBaseUrl}/accounts/update-profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Échec de la mise à jour du profil")
      }

      const data = await response.json()
      setUser(data)
      return data
    } catch (error) {
      console.error("Erreur de mise à jour du profil:", error)
      throw error
    }
  }

  // Valeur du contexte
  const value = {
    isLoggedIn,
    isAuthLoading,
    user,
    login,
    logout,
    register,
    verifyEmail,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

