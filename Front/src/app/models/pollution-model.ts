export type PollutionType = 
  | 'Plastique' 
  | 'Chimique' 
  | 'Dépôt sauvage' 
  | 'Eau' 
  | 'Air' 
  | 'Autre';

export interface PollutionData {
  titre: string;
  type: PollutionType;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}