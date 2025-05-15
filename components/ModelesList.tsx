// components/relances-clients/ModelesList.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Trash, Mail, Plus } from "lucide-react";
import { ModeleEmail } from "@/types/Campagnes";
import { useToast } from "@/components/ui/use-toastx";
import { RelanceService } from "@/services/service-campagne";
import { useAuth } from "@/hooks/useAuth";

interface ModelesListProps {
    modeles: ModeleEmail[];
    selectedModele: number | null;
    onSelectModele: (id: number | null) => void;
    refreshData: () => void;
    onNewModele?: () => void;
}

export function ModelesList({ modeles, selectedModele, onSelectModele, refreshData, onNewModele }: ModelesListProps) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedModele, setEditedModele] = useState<ModeleEmail | null>(null);
    const { token } = useAuth();
    const router = useRouter();

    // Fonction pour normaliser les variables
    const normalizeVariables = (vars: string | string[] | null | undefined): string[] => {
        if (!vars) return [];
        if (Array.isArray(vars)) return vars;
        if (typeof vars === 'string') {
            try {
                // Essaye de parser si c'est une chaîne JSON
                const parsed = JSON.parse(vars);
                return Array.isArray(parsed) ? parsed : [vars];
            } catch {
                // Sinon split par virgules
                return vars.split(',').map((v: string) => v.trim()).filter(Boolean);
            }
        }
        return [];
    };

    const handleEditClick = () => {
        if (selectedModele) {
            const modele = modeles.find(m => m.id === selectedModele);
            if (modele) {
                setEditedModele({
                    ...modele,
                    variables: normalizeVariables(modele.variables)
                });
                setIsEditing(true);
            }
        }
    };

    const handleSave = async () => {
        if (!token) {
            router.push('/responsable/auth/login');
            return;
        }

        if (!editedModele) return;

        try {
            await RelanceService.updateModele(editedModele.id, {
                ...editedModele,
                variables: editedModele.variables // Keep it as a string[] for the API
            }, token);
            toast({
                title: "Modèle sauvegardé",
                description: "Le modèle a été mis à jour avec succès.",
                createdAt: Date.now()
            });
            refreshData();
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la sauvegarde.",
                variant: "destructive",
                createdAt: Date.now()
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedModele || !token) return;

        try {
            await RelanceService.deleteModele(selectedModele, token);
            toast({
                title: "Modèle supprimé",
                description: "Le modèle a été supprimé avec succès.",
                createdAt: Date.now()
            });
            onSelectModele(null);
            refreshData();
        } catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression.",
                variant: "destructive",
                createdAt: Date.now()
            });
        }
    };

    // Récupère le modèle sélectionné avec des variables normalisées
    const selectedModeleData = modeles.find(m => m.id === selectedModele);
    const modeleVariables = selectedModeleData ? normalizeVariables(selectedModeleData.variables) : [];

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">Modèles d&aposemails</h2>
                    <p className="text-muted-foreground">Gérez les modèles utilisés pour vos campagnes de relance</p>
                </div>
                <div className="flex space-x-2">
                    <Select
                        value={selectedModele?.toString() || ""}
                        onValueChange={(value) => onSelectModele(value ? parseInt(value) : null)}
                    >
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                            {modeles.map((modele) => (
                                <SelectItem key={modele.id} value={modele.id.toString()}>
                                    {modele.nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={onNewModele}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau
                    </Button>
                    <Button
                        onClick={handleEditClick}
                        disabled={!selectedModele}
                    >
                        {isEditing ? "Annuler" : "Modifier"}
                    </Button>
                </div>
            </div>

            {selectedModele ? (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{selectedModeleData?.nom}</CardTitle>
                                <CardDescription>
                                    Type: {selectedModeleData?.type}
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditing && editedModele ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sujet">Sujet de l&aposemail *</Label>
                                    <Input
                                        id="sujet"
                                        value={editedModele.sujet}
                                        onChange={(e) => setEditedModele({ ...editedModele, sujet: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contenu">Contenu de l&aposemail *</Label>
                                    <Textarea
                                        id="contenu"
                                        rows={10}
                                        value={editedModele.contenu}
                                        onChange={(e) => setEditedModele({ ...editedModele, contenu: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Variables disponibles *</Label>
                                    <Input
                                        value={editedModele.variables.join(", ")}
                                        onChange={(e) => setEditedModele({
                                            ...editedModele,
                                            variables: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
                                        })}
                                        placeholder="Séparez les variables par des virgules (ex: prenom, voyage, lien)"
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Utilisez ces variables dans le contenu avec {"{{variable}}"}
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button onClick={handleSave}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Sauvegarder
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Sujet de l&aposemail</Label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {selectedModeleData?.sujet}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Contenu de l&aposemail</Label>
                                    <pre className="whitespace-pre-wrap p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {selectedModeleData?.contenu}
                                    </pre>
                                </div>
                                <div className="space-y-2">
                                    <Label>Variables disponibles</Label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        {modeleVariables.map(v => (
                                            <span key={v} className="inline-block bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded mr-2 mb-2 text-sm">
                                                {"{{" + v + "}}"}
                                            </span>
                                        ))}
                                        {modeleVariables.length === 0 && (
                                            <p className="text-muted-foreground text-sm">Aucune variable définie</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Aucun modèle sélectionné</p>
                        <p className="text-muted-foreground mb-6">
                            Sélectionnez un modèle existant ou créez-en un nouveau
                        </p>
                        <Button onClick={onNewModele}>
                            <Plus className="mr-2 h-4 w-4" />
                            Créer un modèle
                        </Button>
                    </CardContent>
                </Card>
            )}
        </>
    );
}