import { Badge, type BadgeProps } from "@/components/ui/badge"

interface CustomBadgeProps extends BadgeProps {
  status: "Confirmée" | "En attente" | "Payée" | "Annulée"
}

export function CustomBadge({ status, ...props }: CustomBadgeProps) {
  const statusStyles = {
    Confirmée: "bg-green-100 text-green-800 hover:bg-green-200",
    "En attente": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Payée: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Annulée: "bg-red-100 text-red-800 hover:bg-red-200",
  }

  return (
    <Badge variant="outline" className={statusStyles[status]} {...props}>
      {status}
    </Badge>
  )
}

