// src/services/service-users.ts
import { UrlConfig } from "@/utils/Config"
import { UserInfo } from "@/types/users"

interface RegisterUserData {
    email: string
    username: string
    password: string
    password2: string
    user_type: string
    gender?: string
    nationality?: string
    age?: number
    city?: string
    country?: string
    phone_number?: string
}

interface LoginResponse {
    access: string
    refresh: string
}

interface ApiError {
    detail?: string
    error?: string
    [key: string]: string | number | boolean | null | undefined
}

export const UserService = {
    /**
     * Vérifie l'authentification d'un utilisateur via son token
     */
    async verifyAuth(token: string): Promise<UserInfo | null> {
        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/auth/profiles/profiles/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) return null

            const userData = await response.json()

            const rawUser = userData.user

            if (!rawUser) return null

            return {
                id: rawUser.id,
                email: rawUser.email,
                username: rawUser.username,
                user_type: rawUser.is_responsable ? "responsable" : rawUser.is_client ? "client" : "inconnu",
                is_responsable: rawUser.is_responsable,
                is_client: rawUser.is_client,
                nationality: rawUser.nationality,
                phone_number: rawUser.phone_number,
                first_name: rawUser.first_name,
                last_name: rawUser.last_name
            }
        } catch (error) {
            console.error("Auth verification error:", error)
            return null
        }
    },

    /**
     * Connecte un utilisateur et retourne les tokens
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${UrlConfig.apiBaseUrl}/auth/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const errorData: ApiError = await response.json()
            throw new Error(errorData.detail || "Login failed")
        }

        return response.json()
    },

    /**
     * Enregistre un nouvel utilisateur
     */
    async register(userData: RegisterUserData): Promise<{ success: boolean; message: string }> {
        const formattedData = {
            email: userData.email,
            username: userData.username,
            password: userData.password,
            password2: userData.password2,
            user_type: userData.user_type,
            gender: userData.gender || "",
            nationality: userData.nationality || "",
            age: userData.age || null,
            city: userData.city || "",
            country: userData.country || "",
            phone_number: userData.phone_number || "",
        }

        const response = await fetch(`${UrlConfig.apiBaseUrl}/auth/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
        })

        if (!response.ok) {
            const errorData: ApiError = await response.json()
            let errorMessage = "Registration failed"

            // Gestion des erreurs de validation
            const errorFields = [
                "email", "username", "password", "password2",
                "user_type", "phone_number", "detail", "non_field_errors"
            ]

            for (const field of errorFields) {
                if (errorData[field]) {
                    errorMessage = Array.isArray(errorData[field])
                        ? errorData[field].join(", ")
                        : String(errorData[field])
                    break
                }
            }

            throw new Error(errorMessage)
        }

        return response.json()
    },

    /**
     * Vérifie un email avec le code reçu
     */
    async verifyEmail(email: string, code: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${UrlConfig.apiBaseUrl}/auth/verify-email/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }),
        })

        if (!response.ok) {
            const errorData: ApiError = await response.json()
            throw new Error(errorData.error || "Email verification failed")
        }

        return response.json()
    },

    /**
     * Met à jour le profil utilisateur
     */
    async updateProfile(
        token: string,
        profileData: {
            user: {
                username: string;
                email: string;
            };
            nationality: string;
            phone_number: string;
            avatar: string;
        }
    ): Promise<{ success: boolean; message: string; user?: UserInfo }> {
        try {
            const response = await fetch(`${UrlConfig.apiBaseUrl}/auth/profiles/update-profile/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            console.log("Réponse du serveur:", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Détails de l'erreur:", errorData);
                return {
                    success: false,
                    message: errorData.detail || "Échec de la mise à jour du profil",
                };
            }

            const updatedUser = await response.json();
            return {
                success: true,
                message: "Profil mis à jour avec succès",
                user: updatedUser,
            };
        } catch (error) {
            console.error("Erreur réseau:", error);
            return {
                success: false,
                message: "Erreur réseau lors de la mise à jour du profil",
            };
        }
    },


    async refreshToken(refreshToken: string): Promise<{ access: string }> {
        const response = await fetch(`${UrlConfig.apiBaseUrl}/auth/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        })

        if (!response.ok) {
            throw new Error("Token refresh failed")
        }

        return response.json()
    }

}