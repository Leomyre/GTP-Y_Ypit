export interface UserInfo {
    id: number
    username: string
    email: string
    phone_number: string | null
    user_type: string
    is_client: boolean
    is_responsable: boolean
    first_name: string
    last_name: string
    avatar?: string
}

export interface login {
    email?: string
    password: string
}

export interface Profile {
    id: number
    address: string
    avatar: string
    created_at: string
    updated_at: string
    date_of_birth: string | null// ou un type plus précis si tu sais ce qu'il y a dedans
    user: UserInfo
}

export interface ProfileState {
    username: string
    nationality: string
    email: string
    phone_number: string | null
    photoUrl: string
}
