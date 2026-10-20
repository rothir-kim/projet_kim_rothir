import { Filtres } from '../modeles/filtres.modele';
import { Pollution } from '../modeles/pollution.modele';

const normaliser = (texte: string): string =>
  texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

export function filtrerPollutions(pollutions: Pollution[], filtres: Filtres): Pollution[] {
  const lieuRecherche = normaliser(filtres.lieu);

  return pollutions.filter(
    (pollution) =>
      (lieuRecherche === '' || normaliser(pollution.lieu).includes(lieuRecherche)) &&
      (filtres.type === '' || pollution.type === filtres.type) &&
      (!filtres.dateDebut || pollution.date >= filtres.dateDebut) &&
      (!filtres.dateFin || pollution.date <= filtres.dateFin),
  );
}
