"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toastx";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RelanceService from '@/services/service-campagne';
import { useRouter } from "next/navigation";
import { NewCampagneFormProps } from "@/types/Campagnes";


export function NewCampagneForm({ modeles, onCreateSuccess }: NewCampagneFormProps) {
    const { toast } = useToast();
    const { token } = useAuth();
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCampagne, setNewCampagne] = useState({
        nom: "",
        type: "abandon",
        modele_id: modeles.length > 0 ? modeles[0].id.toString() : "",
        delai: "24",
        statut: "inactive",
    });

    const handleCreateCampagne = async () => {
        if (!token) {
            toast({
                title: "Erreur d'authentification",
                description: "Veuillez vous reconnecter",
                variant: "destructive",
                createdAt: Date.now()
            });
            router.push('/responsable/auth/login');
            return;
        }

        if (!newCampagne.nom || !newCampagne.modele_id) {
            toast({
                title: "Champs manquants",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
                createdAt: Date.now()
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const campagneToCreate = {
                nom: newCampagne.nom,
                type: newCampagne.type,
                modele_id: parseInt(newCampagne.modele_id),
                delai: newCampagne.type !== "promotion" ? parseInt(newCampagne.delai) : null,
                statut: newCampagne.statut,
                date_prochaine_execution: newCampagne.type === "promotion" && date
                    ? date.toISOString()
                    : newCampagne.statut === "active"
                        ? new Date().toISOString()
                        : null,
                envoyer_immediatement: newCampagne.statut === "active"
            };

            const response = await RelanceService.createCampagne(campagneToCreate, token);
            if (response) {
                toast({
                    title: "Campagne créée",
                    description: newCampagne.statut === "active"
                        ? "La campagne a été activée et les emails sont en cours d'envoi"
                        : "La campagne a été créée avec succès",
                    createdAt: Date.now()
                });
            }


            setNewCampagne({
                nom: "",
                type: "abandon",
                modele_id: modeles.length > 0 ? modeles[0].id.toString() : "",
                delai: "24",
                statut: "inactive",
            });

            if (onCreateSuccess) {
                onCreateSuccess();
            }

        } catch (error) {
            console.error("Erreur création campagne:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de la campagne",
                variant: "destructive",
                createdAt: Date.now()
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Créer une nouvelle campagne</CardTitle>
                <CardDescription>Configurez une nouvelle campagne de relance automatisée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom de la campagne *</Label>
                        <Input
                            id="nom"
                            value={newCampagne.nom}
                            onChange={(e) => setNewCampagne({ ...newCampagne, nom: e.target.value })}
                            placeholder="Ex: Relance clients inactifs"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type de campagne *</Label>
                        <Select
                            value={newCampagne.type}
                            onValueChange={(value) => setNewCampagne({ ...newCampagne, type: value })}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="abandon">Panier abandonné</SelectItem>
                                <SelectItem value="promotion">Promotion</SelectItem>
                                <SelectItem value="rappel">Rappel</SelectItem>
                                <SelectItem value="avis">Demande d&aposavis</SelectItem>
                                <SelectItem value="fidelite">Fidélité</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="modele">Modèle d&aposemail *</Label>
                        <Select
                            value={newCampagne.modele_id}
                            onValueChange={(value) => setNewCampagne({ ...newCampagne, modele_id: value })}
                            disabled={modeles.length === 0 || isSubmitting}
                        >
                            <SelectTrigger id="modele">
                                <SelectValue placeholder={modeles.length === 0 ? "Aucun modèle disponible" : "Sélectionner un modèle"} />
                            </SelectTrigger>
                            <SelectContent>
                                {modeles.map((modele) => (
                                    <SelectItem key={modele.id} value={modele.id.toString()}>
                                        {modele.nom} ({modele.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {newCampagne.type !== "promotion" && (
                        <div className="space-y-2">
                            <Label htmlFor="delai">Délai d&aposenvoi (en heures) *</Label>
                            <Input
                                id="delai"
                                type="number"
                                min="1"
                                value={newCampagne.delai}
                                onChange={(e) => setNewCampagne({ ...newCampagne, delai: e.target.value })}
                                disabled={isSubmitting}
                            />
                            <p className="text-sm text-muted-foreground">
                                Délai après lequel laposemail sera envoyé automatiquement
                            </p>
                        </div>
                    )}

                    {newCampagne.type === "promotion" && (
                        <div className="space-y-2">
                            <Label>Date d&aposenvoi *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        disabled={isSubmitting}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        fromDate={new Date()}
                                        disabled={isSubmitting}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                        <Switch
                            id="statut"
                            checked={newCampagne.statut === "active"}
                            onCheckedChange={(checked) =>
                                setNewCampagne({ ...newCampagne, statut: checked ? "active" : "inactive" })
                            }
                            disabled={isSubmitting}
                        />
                        <Label htmlFor="statut">
                            Activer immédiatement la campagne
                            {newCampagne.statut === "active" && (
                                <span className="text-sm text-muted-foreground block">
                                    Les emails seront envoyés dès la création
                                </span>
                            )}
                        </Label>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={handleCreateCampagne}
                        disabled={!newCampagne.nom || !newCampagne.modele_id || isSubmitting}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Création en cours..." : "Créer la campagne"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}