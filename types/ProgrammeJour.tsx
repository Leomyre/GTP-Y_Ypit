export type ProgrammeJour = {
    id?: number;
    jour: number;
    titre: string;
    activite?: string;
    lieu?: string;
    repas_inclus?: string;
};

export type Props = {
    programme: ProgrammeJour[];
    isResponsable?: boolean;
    voyageId: number;
};