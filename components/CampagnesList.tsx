"use client"

import { useToast } from "@/components/ui/use-toastx";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Pause, Play, Edit, Trash } from "lucide-react";
import { Campagne } from "@/types/Campagnes";
import { useAuth } from "@/hooks/useAuth";
import RelanceService from "@/services/service-campagne";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CampagnesListProps {
    campagnes: Campagne[];
    onSelectCampagne: (id: number) => void;
    refreshData: () => void;
}

export function CampagnesList({ campagnes, onSelectCampagne, refreshData }: CampagnesListProps) {
    const { toast } = useToast();
    const router = useRouter();
    const { token } = useAuth();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
            case 'inactive': return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>;
            case 'planifiee': return <Badge className="bg-blue-500 hover:bg-blue-600">Planifiée</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const handleToggleCampagne = async (id: number, currentStatus: string) => {
        if (!token) {
            router.push('/responsable/tour/login');
            return;
        }

        try {
            await RelanceService.toggleCampagneStatus(id, token);
            toast({
                title: `Campagne ${currentStatus === 'active' ? 'désactivée' : 'activée'}`,
                description: `La campagne a été ${currentStatus === 'active' ? 'désactivée' : 'activée'} avec succès.`,
                createdAt: Date.now()
            });
            refreshData();
        } catch (error) {
            console.error("Toggle campagne error:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la modification du statut.",
                variant: "destructive",
                createdAt: Date.now()
            });
        }
    };

    const handleDeleteCampagne = async (id: number) => {
        if (!token) {
            router.push('/responsable/tour/login');
            return;
        }

        try {
            await RelanceService.deleteCampagne(id, token);
            toast({
                title: "Campagne supprimée",
                description: "La campagne a été supprimée avec succès.",
                createdAt: Date.now()
            });
            refreshData();
        } catch (error) {
            console.error("Delete campagne error:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression.",
                variant: "destructive",
                createdAt: Date.now()
            });
        }
    };
    console.log(campagnes);


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Délai</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Prochaine exécution</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {campagnes.map((campagne) => (
                    <TableRow key={campagne.id}>
                        <TableCell className="font-medium cursor-pointer hover:underline" onClick={() => onSelectCampagne(campagne.id)}>
                            {campagne.nom}
                        </TableCell>
                        <TableCell>{getStatusBadge(campagne.statut)}</TableCell>
                        <TableCell>
                            {campagne.delai ? (
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {campagne.delai}h
                                </div>
                            ) : '-'}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                {campagne.destinataires || 0}
                            </div>
                        </TableCell>
                        <TableCell>
                            {campagne.date_prochaine_execution ? (
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {format(new Date(campagne.date_prochaine_execution), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                </div>
                            ) : '-'}
                        </TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onSelectCampagne(campagne.id)}
                                    title="Modifier"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={campagne.statut === "active" ? "default" : "outline"}
                                    onClick={() => handleToggleCampagne(campagne.id, campagne.statut)}
                                    title={campagne.statut === "active" ? "Désactiver" : "Activer"}
                                >
                                    {campagne.statut === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDeleteCampagne(campagne.id)}
                                    title="Supprimer"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}