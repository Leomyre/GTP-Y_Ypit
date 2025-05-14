"use client";

import { useDevise } from "@/context/DeviseContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const devisesDisponibles = ["EUR", "USD", "MGA", "GBP", "CAD"];

export function DeviseSelector() {
    const { devise, setDevise } = useDevise();

    return (
        <Select value={devise} onValueChange={setDevise}>
            <SelectTrigger className="w-[90px] h-8 text-sm">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {devisesDisponibles.map((d) => (
                    <SelectItem key={d} value={d}>
                        {d}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
