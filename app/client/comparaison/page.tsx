"use client"


import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ComparaisonTable } from "@/components/ComparaisonTable"

function PageContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get("ids")
  const initialSelectedIds = ids ? ids.split(",").map(Number) : []

  return <ComparaisonTable initialSelectedIds={initialSelectedIds} />
}

export default function ComparaisonVoyages() {
  return (
    <Suspense fallback={<div>Chargement de la comparaison...</div>}>
      <PageContent />
    </Suspense>
  )
}