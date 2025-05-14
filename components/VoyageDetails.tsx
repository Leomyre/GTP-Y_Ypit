"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, StarIcon, DollarSign } from "lucide-react";
import { VoyageService } from "@/services/service-voyages";
import { VoyageDetailsSkeleton } from "@/components/skeletons/voyage-details-skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ProgrammeAccordion } from "@/components/ProgrammeAccordion";
import { Voyage } from "@/types/voyages";
import { useCallback } from "react";
import SectionDescription from "@/components/SectionDescription";

export function VoyageDetails() {
    const router = useRouter();
    const { id } = useParams();
    const { user, isLoggedIn, token } = useAuth();

    const [voyage, setVoyage] = useState<Voyage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const enregistrerVoyageConsulte = useCallback((voyageId: number, voyageDetails: Voyage) => {
        if (!token) return;
        try {
            const voyagesConsultes = JSON.parse(localStorage.getItem("voyagesConsultes") || "[]");
            const existingIndex = voyagesConsultes.findIndex((v: Voyage) => v.id === voyageId);

            if (existingIndex !== -1) {
                voyagesConsultes[existingIndex].date_consultation = new Date().toISOString();
            } else {
                voyagesConsultes.push({
                    id: voyageId,
                    nom: voyageDetails.titre,
                    destination: voyageDetails.destination_nom,
                    prix: voyageDetails.prix,
                    date_consultation: new Date().toISOString(),
                });
            }

            const voyagesRecents = voyagesConsultes
                .sort((a: { date_consultation: string }, b: { date_consultation: string }) =>
                    new Date(b.date_consultation).getTime() - new Date(a.date_consultation).getTime()
                )
                .slice(0, 10);

            localStorage.setItem("voyagesConsultes", JSON.stringify(voyagesRecents));
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du voyage consulté:", error);
        }
    }, [token])

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const fetchedVoyage = await VoyageService.getVoyageDetails(Number(id));
                setVoyage(fetchedVoyage);
                setLoading(false);

                if (isLoggedIn) {
                    enregistrerVoyageConsulte(fetchedVoyage.id, fetchedVoyage);
                }
            } catch (err) {
                console.error("Erreur de chargement des détails du voyage:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isLoggedIn, enregistrerVoyageConsulte]);

    const handleReservation = () => {
        if (!isLoggedIn) {
            router.replace("/client/auth/login");
        } else {
            router.push(`/client/paiement?voyageId=${id}`);
        }
    };

    if (loading) return <VoyageDetailsSkeleton />;
    if (error) return <div className="text-center mt-10 text-red-500">Erreur de chargement du voyage</div>;
    if (!voyage) return <div className="text-center mt-10">Voyage non trouvé</div>;

    return (
        <div className="space-y-4 sm:space-y-6">

            <Card className="overflow-hidden">
                <Image
                    src={voyage.images || "/placeholder.svg"}
                    alt={voyage.titre}
                    width={1200}
                    height={400}
                    className="w-full h-48 sm:h-64 object-cover"
                />
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <CardTitle className="text-xl sm:text-2xl">{voyage.titre}</CardTitle>
                            <p className="text-sm sm:text-base text-muted-foreground">{voyage.agence_nom}</p>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <StarIcon className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                            <span className="text-sm sm:text-base">{voyage.niveau_confort}/5</span>
                            {/* <span className="text-sm sm:text-base ml-2">({voyage.likes || 0})</span> */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoItem icon={MapPinIcon} text={`Départ de ${voyage.ville_depart}`} />
                        <InfoItem icon={CalendarIcon} text={`Date au choix`} />
                        <InfoItem icon={DollarSign} text={`${voyage.prix} € par personnes`} />
                    </div>

                    <SectionDescription title="Description" content={voyage.description || ""} />
                    {/* <Section title="Ce qui est inclus" list={voyage.inclus} /> */}
                    <Section
                        title="Programme"
                        programme={
                            <ProgrammeAccordion
                                programme={voyage.programmes_jour}
                                isResponsable={user?.is_responsable}
                                voyageId={voyage.id}
                            />
                        }
                    />

                    {!user?.is_responsable && (
                        <Button className="w-full mt-4" onClick={handleReservation}>
                            Réserver maintenant
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function InfoItem({ icon: Icon, text }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string }) {
    return (
        <div className="flex items-center">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">{text}</span>
        </div>
    );
}

function Section({ title, content, list, programme }: { title: string; content?: string; list?: string[]; programme?: React.ReactNode }) {
    return (
        <div className="mt-6">
            <h3 className="font-semibold mb-2 text-base sm:text-lg">{title}</h3>
            {content && <p className="text-sm sm:text-base">{content}</p>}
            {list && (
                <ul className="list-disc list-inside text-sm sm:text-base space-y-1">
                    {list.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}
            {programme && <div className="mt-4">{programme}</div>}
        </div>
    );
}
