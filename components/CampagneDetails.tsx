// components/relances-clients/CampagneDetails.tsx
"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Mail, Edit, BarChart2, Users, Clock, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Campagne, ModeleEmail } from "@/types/Campagnes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RelanceService } from "@/services/service-campagne";
import { useToast } from "@/components/ui/use-toastx";

interface CampagneDetailsProps {
    campagne: Campagne;
    modele?: ModeleEmail;
    onClose: () => void;
    onEditModele: () => void;
    refreshData: () => void;
}

export function CampagneDetails({ campagne, modele, onClose, onEditModele, refreshData }: CampagneDetailsProps) {
    const { toast } = useToast();
    const { token } = useAuth();
    const router = useRouter();

    const getTypeBadge = (type: string) => {
        const badgeConfig = {
            abandon: { text: "Panier abandonné", className: "bg-red-500 hover:bg-red-600" },
            promotion: { text: "Promotion", className: "bg-purple-500 hover:bg-purple-600" },
            rappel: { text: "Rappel", className: "bg-blue-500 hover:bg-blue-600" },
            avis: { text: "Avis", className: "bg-green-500 hover:bg-green-600" },
            fidelite: { text: "Fidélité", className: "bg-yellow-500 hover:bg-yellow-600" }
        };

        return <Badge className={badgeConfig[type as keyof typeof badgeConfig]?.className || ""}>
            {badgeConfig[type as keyof typeof badgeConfig]?.text || "Autre"}
        </Badge>;
    };

    const getStatutBadge = (statut: string) => {
        const badgeConfig = {
            active: { text: "Active", className: "bg-green-500 hover:bg-green-600" },
            inactive: { text: "Inactive", className: "bg-gray-500 hover:bg-gray-600" },
            planifiee: { text: "Planifiée", className: "bg-blue-500 hover:bg-blue-600" }
        };

        return <Badge className={badgeConfig[statut as keyof typeof badgeConfig]?.className || ""}>
            {badgeConfig[statut as keyof typeof badgeConfig]?.text || "Inconnu"}
        </Badge>;
    };

    const toggleCampagneStatus = async () => {
        if (!token) {
            router.push('responsable/tour/login');
            return;
        }

        try {
            await RelanceService.toggleCampagneStatus(campagne.id, token);
            toast({
                title: "Statut modifié",
                description: `La campagne est maintenant ${campagne.statut === 'active' ? 'inactive' : 'active'}`,
                createdAt: Date.now()
            });
            refreshData();
        } catch (error) {
            console.log(error);

            toast({
                title: "Erreur",
                description: "Impossible de modifier le statut de la campagne",
                variant: "destructive",
                createdAt: Date.now()
            });
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "PPPp", { locale: fr });
    };

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Détails de la campagne</CardTitle>
                        <div className="flex items-center mt-2 space-x-2">
                            {getTypeBadge(campagne.type)}
                            {getStatutBadge(campagne.statut)}
                        </div>
                    </div>
                    <Button
                        variant={campagne.statut === 'active' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={toggleCampagneStatus}
                    >
                        {campagne.statut === 'active' ? 'Désactiver' : 'Activer'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section Informations */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <ChevronRight className="h-5 w-5 mr-1 text-primary" />
                            Informations générales
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Délai d&aposenvoi
                                </span>
                                <span className="font-medium">
                                    {campagne.delai ? `${campagne.delai} heures` : "-"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Dernière exécution
                                </span>
                                <span className="font-medium">
                                    {formatDate(campagne.derniere_execution)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Prochaine exécution
                                </span>
                                <span className="font-medium">
                                    {formatDate(campagne.prochaine_execution)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section Performances */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <BarChart2 className="h-5 w-5 mr-1 text-primary" />
                            Performances
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Destinataires
                                </span>
                                <span className="font-medium">
                                    {campagne.destinataires || 0}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">
                                    Taux d&aposouverture
                                </span>
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">
                                        {campagne.taux_ouverture !== null ? `${campagne.taux_ouverture}%` : "-"}
                                    </span>
                                    {campagne.taux_ouverture !== null && (
                                        <div className={`h-2 w-8 rounded-full ${campagne.taux_ouverture > 50 ? 'bg-green-500' :
                                            campagne.taux_ouverture > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">
                                    Taux de conversion
                                </span>
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">
                                        {campagne.taux_conversion !== null ? `${campagne.taux_conversion}%` : "-"}
                                    </span>
                                    {campagne.taux_conversion !== null && (
                                        <div className={`h-2 w-8 rounded-full ${campagne.taux_conversion > 20 ? 'bg-green-500' :
                                            campagne.taux_conversion > 10 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Modèle d'email */}
                <div className="pt-4">
                    <h3 className="text-lg font-semibold flex items-center mb-4">
                        <Mail className="h-5 w-5 mr-1 text-primary" />
                        Modèle d&aposemail utilisé
                    </h3>

                    {modele ? (
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base">{modele.sujet}</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onEditModele}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Modifier
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Contenu du message</Label>
                                    <pre className="mt-2 whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                                        {modele.contenu}
                                    </pre>
                                </div>

                                <div>
                                    <Label>Variables disponibles</Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {modele.variables.map((v) => (
                                            <Badge
                                                key={v}
                                                variant="outline"
                                                className="font-mono"
                                            >
                                                {"{{" + v + "}}"}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center">
                                    Aucun modèle associé à cette campagne
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Fermer
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}