"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toastx";
import { VoyageService } from "@/services/service-voyages";
import { useAuth } from "@/hooks/useAuth";
import { ProgrammeJour } from "@/types/ProgrammeJour";


export default function ModifierProgrammeJourPage() {
  const { jourId, voyageId } = useParams<{ jourId: string; voyageId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoggedIn, token } = useAuth();

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
    // Sécurité : redirige si l'utilisateur n'est pas connecté ou n'est pas un responsable
    if (!isLoggedIn || !user || user.is_resposanble !== "true") {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être un responsable pour accéder à cette page.",
      });
      router.push("/"); // Redirection vers l'accueil ou la page login
      return;
    }

    if (!voyageId || Array.isArray(voyageId) || !jourId || Array.isArray(jourId)) return;

    const fetchJour = async () => {
      try {
        const data = await VoyageService.getProgrammeJour(Number(voyageId), Number(jourId));
        setForm(data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors du chargement des données.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJour();
  }, [jourId, voyageId, isLoggedIn, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await VoyageService.updateProgrammeJour(Number(voyageId), Number(jourId), form, token);

      toast({
        title: "Succès",
        description: "Jour mis à jour avec succès !",
      });

      router.push(`/responsable/voyages/${voyageId}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la mise à jour.",
      });
    }
  };

  if (loading) return <p className="mt-6 text-center">Chargement...</p>;

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
