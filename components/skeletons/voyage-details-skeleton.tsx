import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function VoyageDetailsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Skeleton className="h-10 w-24 mb-4" />

      <Card className="overflow-hidden">
        <Skeleton className="w-full h-48 sm:h-64" />
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <Skeleton className="h-4 w-32 sm:w-40" />
              </div>
            ))}
          </div>

          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <ul className="list-disc list-inside">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4 mb-1" />
              ))}
            </ul>
          </div>

          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <ul className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex">
                  <Skeleton className="h-4 w-16 mr-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))}
            </ul>
          </div>

          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    </div>
  )
}

