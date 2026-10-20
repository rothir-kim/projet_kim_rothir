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
  urlPhoto?: string;
}

export interface Pollution extends PollutionSaisie {
  id: number;
}
