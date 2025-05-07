"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation"
import { ReservationService } from "@/services/service-reservations";
import { Reservation, VoyageOption, ReservationStats } from "@/types/Reservation";
import { Badge } from "@/components/ui/badge"
import VoyageService from "@/services/service-voyages";
import { StatCardReservation } from "@/components/StatCardReservation";
import { AIInsights } from "@/components/AIInsights";

export default function ResponsibleReservationsPage() {
  const { user, token } = useAuth();
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [voyages, setVoyages] = useState<VoyageOption[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [selectedVoyage, setSelectedVoyage] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formatage des données pour l'analyse IA
  const reservationsData = reservations.map(reservation => ({
    id: reservation.id,
    voyage: reservation.voyage.titre,
    client: `${reservation.utilisateur.prenom} ${reservation.utilisateur.nom}`,
    date: reservation.date_reservation,
    participants: reservation.nombre_adultes + reservation.nombre_enfants,
    montant: reservation.prix_total,
    statut: reservation.est_confirmee ? "confirmé" : reservation.statut_paiement
  }));

  const fetchData = async () => {
    if (!token) {
      router.push("/responsable/auth/login")
      return;
    }

    try {
      setLoading(true);
      const [mesVoyages, allReservations, statistiques] = await Promise.all([
        VoyageService.getVoyages(),
        ReservationService.getAll(token, { responsable: user?.id }),
        ReservationService.getStats(token, { responsable: user?.id })
      ]);

      setVoyages(mesVoyages);
      setReservations(allReservations.results || []);
      setStats(statistiques);
      setError(null);
    } catch (err: any) {
      setError("Erreur lors du chargement des données.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const filteredReservations = selectedVoyage === "all"
    ? reservations
    : reservations.filter(res => res.voyage.id === selectedVoyage);

  const graphData = voyages.map(voyage => ({
    name: voyage.titre,
    reservations: reservations.filter(r => r.voyage.id === voyage.id).length,
    chiffreAffaire: reservations
      .filter(r => r.voyage.id === voyage.id)
      .reduce((sum, r) => sum + r.prix_total, 0)
  }));

  const getStatusBadge = (reservation: Reservation) => {
    if (reservation.est_confirmee) {
      return <Badge variant="success">Confirmé</Badge>;
    }
    switch (reservation.statut_paiement) {
      case 'complete':
        return <Badge variant="primary">Payé</Badge>;
      case 'partiel':
        return <Badge variant="secondary">Partiel</Badge>;
      default:
        return <Badge variant="warning">En attente</Badge>;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchData}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCardReservation
          title="Total Réservations"
          value={stats?.total_reservations || 0}
          loading={loading}
        />
        <StatCardReservation
          title="Réservations Confirmées"
          value={stats?.total_reservations_confirmees || 0}
          loading={loading}
        />
        <StatCardReservation
          title="Chiffre d'Affaires"
          value={`${stats?.chiffre_affaire?.toLocaleString('fr-FR') || 0} €`}
          loading={loading}
        />
      </div>

      {/* Graphiques */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par Voyage</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[300px]">
                <h3 className="text-center mb-2">Nombre de Réservations</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reservations" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[300px]">
                <h3 className="text-center mb-2">Chiffre d'Affaires</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} €`, "CA"]} />
                    <Legend />
                    <Bar dataKey="chiffreAffaire" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Liste des Réservations</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select
              value={selectedVoyage.toString()}
              onValueChange={(value) => setSelectedVoyage(value === "all" ? "all" : parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filtrer par voyage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les voyages</SelectItem>
                {voyages.map((voyage) => (
                  <SelectItem key={voyage.id} value={voyage.id.toString()}>
                    {voyage.titre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voyage</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          {reservation.voyage.titre}
                          <div className="text-xs text-muted-foreground">
                            Ref: {reservation.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{reservation.utilisateur.prenom} {reservation.utilisateur.nom}</div>
                          <div className="text-xs text-muted-foreground">
                            {reservation.utilisateur.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {reservation.nombre_adultes} adultes
                          {reservation.nombre_enfants > 0 && `, ${reservation.nombre_enfants} enfants`}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(reservation)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {reservation.prix_total.toLocaleString('fr-FR')} €
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Aucune réservation trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section AI Insights */}
      {!loading && reservations.length > 0 && (
        <AIInsights
          data={reservationsData}
          pageType="reservations"
        />
      )}
    </div>
  );
}