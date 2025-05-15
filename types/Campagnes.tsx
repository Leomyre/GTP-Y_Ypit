// components/relances-clients/types.ts

export interface Campagne {
    id: number;
    nom: string;
    type: 'abandon' | 'promotion' | 'rappel' | 'avis' | 'fidelite';
    statut: 'active' | 'inactive' | 'planifiee';
    delai: number | null;
    modele_id: number
    destinataires: number;
    taux_ouverture: number | null;
    taux_conversion: number | null;
    derniere_execution: string | null;
    date_prochaine_execution: string | null;
    prochaine_execution: string | null;
}

export interface ModeleEmail {
    id: number;
    nom: string;
    type: string;
    sujet: string;
    contenu: string;
    variables: string[];
}

export interface NewCampagne {
    nom: string;
    type: string;
    modele_id: number;
    delai: number | null;
    statut: string;
    date_prochaine_execution: string | null;
    envoyer_immediatement: boolean
}

export interface NewCampagneFormProps {
    modeles: ModeleEmail[];
    onCreateSuccess?: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    onCreateCampagne: (newCampagne: NewCampagne) => Promise<void>;
}