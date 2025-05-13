"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toastx";
import { VoyageService } from "@/services/service-voyages";
import { useAuth } from "@/hooks/useAuth";
import { ProgrammeJour } from "@/types/ProgrammeJour";
import { Skeleton } from "@/components/ui/skeleton";

export default function ModifierProgrammeJourPage() {
  const { jourId } = useParams();
  const searchParams = useSearchParams();
  const voyageId = searchParams.get("voyageId");
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProgrammeJour>({
    id: 0,
    jour: 1,
    titre: "",
    activite: "",
    lieu: "",
    repas_inclus: "",
  });

  useEffect(() => {
    if (isAuthLoading) return;

    if (!token) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être un responsable pour accéder à cette page.",
        createdAt: Date.now()
      });
      router.push("/");
      return;
    }

    if (!voyageId || !jourId) return;

    const fetchJour = async () => {
      try {
        const data = await VoyageService.getProgrammeJour(Number(voyageId), Number(jourId));
        setForm(data);
      } catch {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des données.",
          createdAt: Date.now()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJour();
  }, [jourId, voyageId, token, isAuthLoading, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const dataToSend = {
      ...form,
      voyage: voyageId,
    };

    try {
      await VoyageService.updateProgrammeJour(Number(voyageId), Number(jourId), dataToSend, token);
      toast({
        title: "Succès",
        description: "Jour mis à jour avec succès !",
        createdAt: Date.now()
      });
      router.push(`/responsable/tour/voyages/${voyageId}`);
    } catch {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour.",
        createdAt: Date.now(),
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-4 animate-pulse">
        <Skeleton className="h-8 w-1/2 rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-24 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-40 mt-6 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Modifier le jour {form.jour}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="titre">Titre</Label>
          <Input id="titre" name="titre" value={form.titre} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="activite">Activité</Label>
          <Textarea id="activite" name="activite" value={form.activite} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="lieu">Lieu</Label>
          <Input id="lieu" name="lieu" value={form.lieu} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="repas_inclus">Repas inclus</Label>
          <Input id="repas_inclus" name="repas_inclus" value={form.repas_inclus} onChange={handleChange} />
        </div>
        <Button type="submit" className="mt-4">
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
}
