"use client"

import { useState, useEffect } from "react"
import FinancialAPI, {
  type FinancialSummary,
  type MonthlyData,
  type DestinationSummary,
  type PeriodType,
} from "@/services/financial-api"

export const useFinancialSummary = (year?: number, month?: number, quarter?: number, periodType?: PeriodType) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params: any = {}

        if (year) params.year = year
        if (periodType === "month" && month) params.month = month
        if (periodType === "quarter" && quarter) params.quarter = quarter

        const data = await FinancialAPI.getFinancialSummary(params)
        setSummary(data)
        setError(null)
      } catch (err) {
        setError("Erreur lors du chargement des données financières")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year, month, quarter, periodType])

  return { summary, loading, error }
}

export const useMonthlyData = (year: number) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await FinancialAPI.getMonthlyData(year)
        setMonthlyData(data)
        setError(null)
      } catch (err) {
        setError("Erreur lors du chargement des données mensuelles")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (year) {
      fetchData()
    }
  }, [year])

  return { monthlyData, loading, error }
}

export const useDestinationSummary = (year?: number, month?: number, quarter?: number, periodType?: PeriodType) => {
  const [destinationSummary, setDestinationSummary] = useState<DestinationSummary[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const params: any = {}

        if (year) params.year = year
        if (periodType === "month" && month) params.month = month
        if (periodType === "quarter" && quarter) params.quarter = quarter

        const data = await FinancialAPI.getDestinationSummary(params)
        setDestinationSummary(data)
        setError(null)
      } catch (err) {
        setError("Erreur lors du chargement des données par destination")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year, month, quarter, periodType])

  return { destinationSummary, loading, error }
}
