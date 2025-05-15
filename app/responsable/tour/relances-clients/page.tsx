// app/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampagnesList } from "@/components/CampagnesList";
import { CampagneDetails } from "@/components/CampagneDetails";
import { ModelesList } from "@/components/ModelesList";
import { NewCampagneForm } from "@/components/NewCampagneForm";
import { RelanceService } from "@/services/service-campagne";
import { useToast } from "@/components/ui/use-toastx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Campagne, ModeleEmail, NewCampagne } from "@/types/Campagnes";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function RelancesClientsPage() {
  const [activeTab, setActiveTab] = useState("campagnes");
  const [selectedCampagne, setSelectedCampagne] = useState<number | null>(null);
  const [selectedModele, setSelectedModele] = useState<number | null>(null);
  const [campagnes, setCampagnes] = useState<Campagne[]>([]);
  const [modeles, setModeles] = useState<ModeleEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingCampagne, setCreatingCampagne] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        router.push('/responsable/auth/login');
        return;
      }

      setLoading(true);
      try {
        const [campagnesData, modelesData] = await Promise.all([
          RelanceService.getCampagnes(token),
          RelanceService.getModeles(token)
        ]);
        setCampagnes(campagnesData);
        setModeles(modelesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive",
          createdAt: Date.now()
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, router, toast]);

  const refreshData = async () => {
    try {
      const [campagnesData, modelesData] = await Promise.all([
        RelanceService.getCampagnes(token!),
        RelanceService.getModeles(token!)
      ]);
      setCampagnes(campagnesData);
      setModeles(modelesData);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir les données",
        variant: "destructive",
        createdAt: Date.now()
      });
    }
  };

  const handleCreateCampagne = async (newCampagne: NewCampagne) => {
    if (!token) {
      router.push('/responsable/auth/login');
      return;
    }

    setCreatingCampagne(true);
    try {
      await RelanceService.createCampagne(newCampagne, token);
      toast({
        title: "Succès",
        description: "La campagne a été créée avec succès",
        createdAt: Date.now()
      });
      await refreshData();
      setActiveTab("campagnes");
      setSelectedCampagne(null);
    } catch (error) {
      console.error("Erreur lors de la création de la campagne:", error);
      toast({
        title: "Erreur",
        description: "Échec de la création de la campagne",
        variant: "destructive",
        createdAt: Date.now()
      });
    } finally {
      setCreatingCampagne(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-10 w-[300px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Automatisation des Relances Clients</h1>

      <Tabs
        defaultValue="campagnes"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="campagnes">Campagnes</TabsTrigger>
          <TabsTrigger value="modeles">Modèles d&aposemails</TabsTrigger>
          <TabsTrigger value="nouvelle">Nouvelle campagne</TabsTrigger>
        </TabsList>

        <TabsContent value="campagnes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Campagnes de relance</CardTitle>
                  <CardDescription>
                    {campagnes.length} campagne(s) configurée(s)
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("nouvelle")}
                >
                  Créer une campagne
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CampagnesList
                campagnes={campagnes}
                onSelectCampagne={(id) => {
                  setSelectedCampagne(id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                refreshData={refreshData}
              />
            </CardContent>
          </Card>

          {selectedCampagne && (
            <CampagneDetails
              campagne={campagnes.find(c => c.id === selectedCampagne)!}
              modele={modeles.find(m => m.id === campagnes.find(c => c.id === selectedCampagne)?.modele_id)}
              onClose={() => setSelectedCampagne(null)}
              onEditModele={() => {
                const campagne = campagnes.find(c => c.id === selectedCampagne);
                if (campagne?.modele_id) {
                  setSelectedModele(campagne.modele_id);
                }
                setActiveTab("modeles");
              }}
              refreshData={refreshData}
            />
          )}
        </TabsContent>

        <TabsContent value="modeles" className="space-y-6">
          <ModelesList
            modeles={modeles}
            selectedModele={selectedModele}
            onSelectModele={setSelectedModele}
            refreshData={refreshData}
            onNewModele={() => {
              setSelectedModele(null);
              // Vous pourriez ajouter une logique pour créer un nouveau modèle ici
            }}
          />
        </TabsContent>

        <TabsContent value="nouvelle" className="space-y-6">
          <NewCampagneForm
            modeles={modeles}
            onCreateCampagne={handleCreateCampagne}
            isLoading={creatingCampagne}
            onCancel={() => setActiveTab("campagnes")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}