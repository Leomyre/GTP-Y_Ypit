"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoyageService } from "@/services/service-voyages";
import { useAuth } from "@/hooks/useAuth";
import { Voyage } from "@/types/voyages"
import { useReservation } from "@/hooks/useReservation";
import { usePaiement } from "@/hooks/usePaiement";

export default function Paiement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const voyageId = searchParams.get("voyageId");
  const { token } = useAuth();
  const [dateDepart, setDateDepart] = useState<string>("");
  const [voyage, setVoyage] = useState<Voyage | null>(null)
  const [loadingVoyage, setLoadingVoyage] = useState(true);
  const { createReservation } = useReservation();
  const { payer } = usePaiement();
  const [paiement, setPaiement] = useState({
    numeroCarte: "",
    nomCarte: "",
    dateExpiration: "",
    cvc: "",
    methodePaiement: "",
  });

  const [nombreAdultes, setNombreAdultes] = useState(1);
  const [nombreEnfants, setNombreEnfants] = useState(0);

  useEffect(() => {
    if (!voyageId) return;

    const fetchVoyage = async () => {
      try {
        const fetchedVoyage = await VoyageService.getVoyageDetails(Number(voyageId));
        setVoyage(fetchedVoyage);
      } catch (err) {
        console.error("Erreur lors de la récupération du voyage:", err);
      } finally {
        setLoadingVoyage(false);
      }
    };

    fetchVoyage();
  }, [voyageId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaiement({ ...paiement, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setPaiement({ ...paiement, methodePaiement: value });
  };

  const handleReservationOnly = async () => {
    if (!voyage || !token) return;
    try {
      await createReservation({
        voyageId: voyage.id,
        nombreAdultes,
        nombreEnfants,
        dateDepart,
        token,
      });
      router.push("/client/profil/historique-reservations");
    } catch { }
  };

  const handlePaiementAndReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voyage || !token) return;

    try {
      const reservation = await createReservation({
        voyageId: voyage.id,
        nombreAdultes,
        nombreEnfants,
        dateDepart,
        token,
      });

      await payer({
        reservationId: reservation.id,
        montant: reservation.prix_total,
        methode: paiement.methodePaiement,
        details: {
          numeroCarte: paiement.numeroCarte,
          nomCarte: paiement.nomCarte,
          dateExpiration: paiement.dateExpiration,
          cvc: paiement.cvc,
        },
      });

      router.push("/client/profil/historique-reservations");
    } catch { }
  };


  if (loadingVoyage) {
    return <div className="text-center py-10">Chargement des informations du voyage...</div>;
  }

  if (!voyage) {
    return <div className="text-center text-red-500 py-10">Erreur: Voyage introuvable.</div>;
  }

  const prixTotal = (nombreAdultes * Number(voyage.prix ?? 0)) + (nombreEnfants * (Number(voyage.prix ?? 0) * 0.7));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Paiement</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Votre voyage sélectionné</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nom :</strong> {voyage.titre}</p>
          <p><strong>Prix par personne :</strong> {voyage.prix} €</p>
          <p><strong>Prix total :</strong> {prixTotal} €</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre d&aposadultes</Label>
            <Input
              type="number"
              min={1}
              value={nombreAdultes}
              onChange={(e) => setNombreAdultes(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Nombre d&aposenfants</Label>
            <Input
              type="number"
              min={0}
              value={nombreEnfants}
              onChange={(e) => setNombreEnfants(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Date de départ</Label>
            <Input
              type="date"
              value={dateDepart}
              onChange={(e) => setDateDepart(e.target.value)}
              required
            />
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations de paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePaiementAndReservation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="methodePaiement">Méthode de paiement</Label>
              <Select onValueChange={handleSelectChange} value={paiement.methodePaiement}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carte">Carte de crédit</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paiement.methodePaiement === "carte" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="numeroCarte">Numéro de carte</Label>
                  <Input
                    id="numeroCarte"
                    name="numeroCarte"
                    value={paiement.numeroCarte}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomCarte">Nom sur la carte</Label>
                  <Input
                    id="nomCarte"
                    name="nomCarte"
                    value={paiement.nomCarte}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateExpiration">Date d&aposexpiration</Label>
                    <Input
                      id="dateExpiration"
                      name="dateExpiration"
                      value={paiement.dateExpiration}
                      onChange={handleChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      name="cvc"
                      value={paiement.cvc}
                      onChange={handleChange}
                      placeholder="123"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button type="submit" disabled={loadingVoyage}>
                Payer maintenant
              </Button>
              <Button type="button" onClick={handleReservationOnly} variant="outline" disabled={loadingVoyage}>
                Réserver sans payer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
