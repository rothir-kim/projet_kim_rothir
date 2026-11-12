export const TYPES_POLLUTION = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type TypePollution = (typeof TYPES_POLLUTION)[number];

export interface PollutionSaisie {
  titre: string;
  type: TypePollution;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  urlPhoto: string | null;
  indiceDangerosite: number;
}

export interface Auteur {
  id: number;
  prenom: string;
  nom: string;
}

// auteur vaut null pour les pollutions de départ ou si le compte a été supprimé
export interface Pollution extends PollutionSaisie {
  id: number;
  auteurId: number | null;
  auteur: Auteur | null;
}
