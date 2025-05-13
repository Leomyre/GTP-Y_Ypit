// hooks/useReservation.ts
import { useState } from "react";
import { ReservationService } from "@/services/service-reservations";
import { toast } from "@/components/ui/use-toastx";

interface ReservationParams {
  voyageId: number;
  nombreAdultes: number;
  nombreEnfants: number;
  dateDepart: string;
  token: string;
}

export const useReservation = () => {
  const [loadingReservation, setLoadingReservation] = useState(false);

  const createReservation = async ({
    voyageId,
    nombreAdultes,
    nombreEnfants,
    dateDepart,
    token,
  }: ReservationParams) => {
    setLoadingReservation(true);
    try {
      const reservation = await ReservationService.createReservation({
        voyage_id: voyageId,
        nombre_adultes: nombreAdultes,
        nombre_enfants: nombreEnfants,
        date_depart: dateDepart,
      }, token);
      toast({
        title: "Succès !",
        description: "Réservation créée avec succès !",
        createdAt: Date.now(),
      })
      return reservation;
    } catch (error) {
      console.error("Erreur de réservation :", error);
      toast({
        title: "Echec !",
        description: "Erreur lors de la réservation",
        createdAt: Date.now(),
      })
      throw error;
    } finally {
      setLoadingReservation(false);
    }
  };

  return {
    createReservation,
    loadingReservation,
  };
};
