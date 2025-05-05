import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Types
export type PeriodType = "month" | "quarter" | "year"

export interface FinancialPeriod {
  id: number
  period_type: PeriodType
  year: number
  month?: number
  quarter?: number
}

export interface FinancialData {
  id: number
  period: FinancialPeriod
  revenue: number
  costs: number
  margin: number
  margin_rate: number
}

export interface DestinationFinancialData {
  id: number
  period: FinancialPeriod
  destination: {
    id: number
    name: string
  }
  revenue: number
  costs: number
  margin: number
  margin_rate: number
  percentage: number
}

export interface FinancialSummary {
  total_revenue: number
  total_costs: number
  total_margin: number
  margin_rate: number
}

export interface MonthlyData {
  period__month: number
  period__year: number
  revenue: number
  costs: number
  margin: number
  margin_rate: number
}

export interface DestinationSummary {
  destination__name: string
  revenue: number
  costs: number
  margin: number
  margin_rate: number
  percentage: number
}

// Service API
const FinancialAPI = {
  // Périodes financières
  getPeriods: async (params?: { period_type?: PeriodType; year?: number }): Promise<FinancialPeriod[]> => {
    const response = await axios.get(`${API_URL}/financial/periods/`, { params })
    return response.data
  },

  // Données financières
  getFinancialData: async (params?: {
    year?: number
    month?: number
    quarter?: number
  }): Promise<FinancialData[]> => {
    const response = await axios.get(`${API_URL}/financial/data/`, { params })
    return response.data
  },

  getFinancialSummary: async (params?: {
    year?: number
    month?: number
    quarter?: number
  }): Promise<FinancialSummary> => {
    const response = await axios.get(`${API_URL}/financial/data/summary/`, { params })
    return response.data
  },

  getMonthlyData: async (year: number): Promise<MonthlyData[]> => {
    const response = await axios.get(`${API_URL}/financial/data/monthly_data/`, {
      params: { year },
    })
    return response.data
  },

  // Données financières par destination
  getDestinationData: async (params?: {
    year?: number
    month?: number
    quarter?: number
    destination_id?: number
  }): Promise<DestinationFinancialData[]> => {
    const response = await axios.get(`${API_URL}/financial/destinations/`, { params })
    return response.data
  },

  getDestinationSummary: async (params?: {
    year?: number
    month?: number
    quarter?: number
  }): Promise<DestinationSummary[]> => {
    const response = await axios.get(`${API_URL}/financial/destinations/destination_summary/`, {
      params,
    })
    return response.data
  },

  // Import de données
  importFinancialData: async (data: {
    period_type: PeriodType
    year: number
    month?: number
    quarter?: number
    data: {
      revenue: number
      costs: number
      destinations: Array<{
        destination_id: number
        revenue: number
        costs: number
      }>
    }
  }): Promise<FinancialData> => {
    const response = await axios.post(`${API_URL}/financial/data/import_data/`, data)
    return response.data
  },
}

export default FinancialAPI
