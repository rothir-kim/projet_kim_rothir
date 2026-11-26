import { PollutionLevelPipe } from './pollution-level.pipe';

describe('PollutionLevelPipe', () => {
  const pipe = new PollutionLevelPipe();

  it('donne le bon niveau à chaque limite', () => {
    expect(pipe.transform(0)).toBe('Faible');
    expect(pipe.transform(20)).toBe('Faible');
    expect(pipe.transform(21)).toBe('Modérée');
    expect(pipe.transform(50)).toBe('Modérée');
    expect(pipe.transform(51)).toBe('Élevée');
    expect(pipe.transform(100)).toBe('Élevée');
    expect(pipe.transform(101)).toBe('Dangereuse');
    expect(pipe.transform(150)).toBe('Dangereuse');
  });

  it('renvoie Inconnu sans indice valide', () => {
    expect(pipe.transform(null)).toBe('Inconnu');
    expect(pipe.transform(undefined)).toBe('Inconnu');
    expect(pipe.transform(-1)).toBe('Inconnu');
  });
});
