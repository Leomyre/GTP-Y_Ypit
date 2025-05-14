import { Skeleton } from "@/components/ui/skeleton";

export default function PaiementSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <Skeleton className="h-9 w-[200px] mb-6" />

            <div className="space-y-4">
                {/* Skeleton pour la carte de voyage */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>

                {/* Skeleton pour les participants */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Skeleton pour le formulaire de paiement */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Boutons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
}