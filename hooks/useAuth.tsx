"use client"
import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/services/service-users"
import { UserInfo, RegisterUserData, ProfileState } from "@/types/users"

interface AuthContextType {
  isLoggedIn: boolean
  isAuthLoading: boolean
  user: UserInfo | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterUserData) => Promise<{ success: boolean; message: string }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message: string }>
  updateProfile: (profileData: ProfileState) => Promise<{ success: boolean; message: string }>
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isLoggedIn: false,
    isAuthLoading: true,
    user: null as UserInfo | null,
    token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setState(prev => ({ ...prev, isAuthLoading: false, isLoggedIn: false }))
          return
        }

        const user = await UserService.verifyAuth(token)
        if (user) {
          setState({
            isLoggedIn: true,
            isAuthLoading: false,
            user,
            token
          })
        } else {
          setState(prev => ({ ...prev, isAuthLoading: false, isLoggedIn: false }))
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setState(prev => ({ ...prev, isAuthLoading: false, isLoggedIn: false }))
      }
    }

    checkAuth()
  }, [router])

  const login = async (email: string, password: string) => {
    try {
      const { access, refresh } = await UserService.login(email, password)
      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)

      const user = await UserService.verifyAuth(access)
      if (!user) throw new Error("Authentication failed")

      setState({
        isLoggedIn: true,
        isAuthLoading: false,
        user,
        token: access
      })

      // Redirection basée sur le rôle
      if (user.is_responsable) router.push("/responsable/tour/dashboard")
      else if (user.is_client) router.push("/client/accueil")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setState({
      isLoggedIn: false,
      isAuthLoading: false,
      user: null,
      token: null
    })
    router.push("/client/auth/login")
  }

  const register = async (userData: RegisterUserData) => {
    try {
      await UserService.register(userData)
      return { success: true, message: "Registration successful" }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed"
      }
    }
  }

  const verifyEmail = async (email: string, code: string) => {
    try {
      await UserService.verifyEmail(email, code)
      return { success: true, message: "Email verified" }
    } catch (error) {
      console.error("Email verification error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Verification failed"
      }
    }
  }

  const updateProfile = async (profileData: ProfileState) => {
    try {
      if (!state.token) throw new Error("Not authenticated")
      const user = await UserService.updateProfile(state.token, {
        user: {
          username: profileData.username,
          email: profileData.email
        },
        nationality: profileData.nationality,
        phone_number: profileData.phone_number ?? undefined,
        avatar: profileData.photoUrl
      })
      if (user.user) {
        setState(prev => ({ ...prev, user: user.user ?? null }))
      } else {
        console.error("Invalid user data:", user)
        throw new Error("Failed to update user profile")
      }
      return { success: true, message: "Profile updated" }
    } catch (error) {
      console.error("Profile update error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Update failed"
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      verifyEmail,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}