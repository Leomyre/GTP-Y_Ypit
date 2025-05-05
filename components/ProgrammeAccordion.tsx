"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Props } from "@/types/ProgrammeJour";

export function ProgrammeAccordion({ programme, isResponsable = false }: Props) {
    const [openJour, setOpenJour] = useState<number | null>(null);

    const toggleJour = (jourId: number) => {
        setOpenJour((prev) => (prev === jourId ? null : jourId));
    };

    return (
        <div className="space-y-4">
            {programme.map((jour) => (
                <div
                    key={jour.id}
                    className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800 transition-all"
                >
                    <button
                        className="flex justify-between items-center w-full p-4 font-bold text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => toggleJour(jour.id)}
                    >
                        <span>
                            Jour {jour.jour} : {jour.titre}
                        </span>
                        {openJour === jour.id ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>

                    {openJour === jour.id && (
                        <div className="p-4 pt-0 text-sm space-y-2 text-muted-foreground">
                            {jour.activite && (
                                <p>
                                    <strong>Activité :</strong> {jour.activite}
                                </p>
                            )}
                            {jour.lieu && (
                                <p>
                                    <strong>Lieu :</strong> {jour.lieu}
                                </p>
                            )}
                            {jour.repas_inclus && (
                                <p>
                                    <strong>Repas :</strong> {jour.repas_inclus}
                                </p>
                            )}

                            {isResponsable && (
                                <div className="pt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            window.location.href = `/responsable/tour/programme/${jour.id}/modifier`
                                        }
                                    >
                                        Modifier ce jour
                                    </Button>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
