// types/insights.ts
export interface Insight {
  id: string
  title: string
  description: string
  recommendation: string
  priority: "high" | "medium" | "low"
  metrics?: {
    name: string
    value: string | number
    change?: number
  }[]
}

export interface ClientData {
  id?: number
  username?: string
  email?: string
  reservations_count?: number
  total_spent?: number
  last_reservation_date?: string
}

export interface ReservationData {
  id?: number
  date?: string
  destination?: string
  amount?: number
  status?: string
  client_name?: string
}

export interface VoyageData {
  id?: number
  name?: string
  destination?: string
  popularity?: number
  average_price?: number
  reservations_count?: number
}