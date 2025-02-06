import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FinancialChart from "@/components/FinancialChart"
import { AIInsights } from "@/components/AIInsights"

const monthlyRevenue = [
  { name: "Jan", revenue: 4000 },
  { name: "Fév", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Avr", revenue: 4500 },
  { name: "Mai", revenue: 6000 },
  { name: "Juin", revenue: 7000 },
]

const financialSummary = [
  { label: "Revenu Total", value: "29,500€" },
  { label: "Dépenses", value: "15,000€" },
  { label: "Bénéfice Net", value: "14,500€" },
  { label: "Marge Bénéficiaire", value: "49.15%" },
]

export default function FinancesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finances</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Résumé Financier</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              {financialSummary.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                  <dd className="text-lg font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenus Mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialChart data={monthlyRevenue} />
          </CardContent>
        </Card>
      </div>

      <AIInsights data={{ financialSummary, monthlyRevenue }} page="finances" />
    </div>
  )
}

