import { TypePollution } from './pollution.modele';

export interface Filtres {
  lieu: string;
  type: TypePollution | '';
  dateDebut: string;
  dateFin: string;
}

export const FILTRES_VIDES: Filtres = {
  lieu: '',
  type: '',
  dateDebut: '',
  dateFin: '',
};
