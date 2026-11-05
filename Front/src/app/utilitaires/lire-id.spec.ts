import { lireId } from './lire-id';

describe('lireId', () => {
  it('renvoie le nombre quand l\'id est valide', () => {
    expect(lireId('12')).toBe(12);
  });

  it('renvoie null pour un id invalide', () => {
    expect(lireId(null)).toBeNull();
    expect(lireId('abc')).toBeNull();
    expect(lireId('0')).toBeNull();
    expect(lireId('-3')).toBeNull();
    expect(lireId('1.5')).toBeNull();
  });
});
