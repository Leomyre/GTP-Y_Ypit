"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toastx"; // pour de belles notifications
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Reservation {
    id: number;
    voyage_details: {
        titre: string;
        ville_depart: string;
        ville_arrive: string;
        prix: number;
    };
    nombre_personnes: number;
    prix_total: string;
    statut: string;
}

export default function ConfirmationReservationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservationId");

    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        if (!reservationId) return;

        const fetchReservation = async () => {
            try {
                const res = await axios.get(`/reservations/${reservationId}/`);
                setReservation(res.data);
            } catch (error) {
                console.error("Erreur lors du chargement de la réservation :", error);
                toast.error("Erreur de chargement de la réservation.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [reservationId]);

    const handlePaiement = async () => {
        if (!reservation) return;

        setPaying(true);
        try {
            await axios.post("/paiements/", {
                reservation: reservation.id,
                montant: reservation.prix_total,
                methode: "carte", // tu peux ajouter un sélecteur si tu veux changer de méthode
                statut: "complete", // marquer directement comme payé
            });

            toast.success("Paiement réussi ! 🎉 Votre réservation est confirmée.");
            router.push("/client/mes-reservations"); // ou page d'accueil client
        } catch (error) {
            console.error("Erreur de paiement :", error);
            toast.error("Erreur lors du paiement.");
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!reservation) {
        return <div className="text-center text-red-500">Réservation introuvable.</div>;
    }

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Finaliser votre réservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="font-semibold">Voyage :</p>
                        <p>{reservation.voyage_details.titre} ({reservation.voyage_details.ville_depart} ➔ {reservation.voyage_details.ville_arrive})</p>
                    </div>
                    <div>
                        <p className="font-semibold">Nombre de personnes :</p>
                        <p>{reservation.nombre_personnes}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Total à payer :</p>
                        <p className="text-lg font-bold">{reservation.prix_total} €</p>
                    </div>
                    <Button onClick={handlePaiement} disabled={paying} className="w-full">
                        {paying ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Paiement en cours...
                            </>
                        ) : (
                            "Payer maintenant"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
