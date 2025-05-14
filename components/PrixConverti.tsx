"use client";

import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { useDevise } from "@/context/DeviseContext"; // 👈 Hook du contexte global

type Props = {
    prix?: number;
    deviseOrigine: string;
};

export function PrixConverti({ prix, deviseOrigine }: Props) {
    const { devise: deviseCible } = useDevise(); // 👈 Devise choisie globalement
    const { convertedAmount, loading } = useCurrencyConversion(
        prix ?? 0,
        deviseOrigine,
        deviseCible
    );

    const color =
        convertedAmount === undefined
            ? "text-gray-500"
            : convertedAmount !== null && convertedAmount < 100
                ? "text-green-600"
                : convertedAmount !== null && convertedAmount < 500
                    ? "text-orange-500"
                    : "text-red-600";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className={`font-semibold text-sm ${color}`}>
                {loading
                    ? "Conversion..."
                    : new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: deviseCible,
                    }).format(convertedAmount ?? 0)}
            </span>
        </div>
    );
}
