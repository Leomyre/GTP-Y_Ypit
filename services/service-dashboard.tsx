import axios from "axios"
import { UrlConfig } from "@/utils/Config";
const BASE_URL = `${UrlConfig.apiBaseUrl}/reservations/`;

export async function fetchDashboardStats(token: string) {
    const response = await axios.get(`${BASE_URL}dashboardStats/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export async function fetchReservationsParMois(token: string) {
    const res = await axios.get(`${BASE_URL}stats/reservations-mensuelles/`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
}

export async function fetchRevenusParDestination(token: string) {
    const res = await axios.get(`${BASE_URL}stats/revenus-destinations/`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    console.log(res.data);

    return res.data
}
