// hooks/usePaiement.ts
import { useState } from "react";
import PaiementService from "@/services/service-paiements";
import { toast } from "@/components/ui/use-toastx";
import { useAuth } from "./useAuth";

interface PaiementDetails {
  reservationId: number;
  montant: number;
    methode: string;
    statut?: "complete" | "pending" | "refused";
  details: {
    numeroCarte: string;
    nomCarte: string;
    dateExpiration: string;
    cvc: string;
  };
}

export const usePaiement = () => {
  const [loadingPaiement, setLoadingPaiement] = useState(false);
  const {token} = useAuth()
  const payer = async ({
    reservationId,
    montant,
    methode,
    details,
  }: PaiementDetails) => {
    setLoadingPaiement(true);
    try {
      if (!token) {
        throw new Error("Token is required for paiement.");
      }
      await PaiementService.createPaiement({
        reservation: reservationId,
        montant,
        methode,
        statut: "complete",
        details,
      }, token);

      toast({
        title: "success !",
        description: "Paiement effectué avec succès !",
        createdAt: Date.now(),
      })
    } catch (error) {
      console.error("Erreur de paiement :", error);
      toast({
        title: "Echec !",
        description: "Erreur lors du paiement",
        createdAt: Date.now(),
      })
      throw error;
    } finally {
      setLoadingPaiement(false);
    }
  };

  return {
    payer,
    loadingPaiement,
  };
};
