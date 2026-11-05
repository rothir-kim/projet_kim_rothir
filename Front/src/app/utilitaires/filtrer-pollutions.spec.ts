import { FILTRES_VIDES } from '../modeles/filtres.modele';
import { Pollution } from '../modeles/pollution.modele';
import { filtrerPollutions } from './filtrer-pollutions';

const creerPollution = (id: number, lieu: string, type: Pollution['type'], date: string): Pollution => ({
  id,
  titre: `Pollution ${id}`,
  type,
  description: 'Description',
  date,
  lieu,
  latitude: 0,
  longitude: 0,
  urlPhoto: null,
  auteurId: null,
  auteur: null,
});

const pollutions = [
  creerPollution(1, 'Évry', 'Eau', '2026-09-01'),
  creerPollution(2, 'Marseille', 'Plastique', '2026-09-15'),
  creerPollution(3, 'Paris', 'Eau', '2026-10-01'),
];

describe('filtrerPollutions', () => {
  it('renvoie tout sans filtre', () => {
    expect(filtrerPollutions(pollutions, FILTRES_VIDES)).toHaveLength(3);
  });

  it('ignore les accents et les majuscules sur le lieu', () => {
    const resultat = filtrerPollutions(pollutions, { ...FILTRES_VIDES, lieu: 'evry' });
    expect(resultat.map((p) => p.id)).toEqual([1]);
  });

  it('filtre par type', () => {
    const resultat = filtrerPollutions(pollutions, { ...FILTRES_VIDES, type: 'Eau' });
    expect(resultat.map((p) => p.id)).toEqual([1, 3]);
  });

  it('filtre entre deux dates incluses', () => {
    const filtres = { ...FILTRES_VIDES, dateDebut: '2026-09-15', dateFin: '2026-10-01' };
    expect(filtrerPollutions(pollutions, filtres).map((p) => p.id)).toEqual([2, 3]);
  });
});
