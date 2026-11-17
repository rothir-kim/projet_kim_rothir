import { FORMAT_EMAIL } from './email.validateur';

describe('FORMAT_EMAIL', () => {
  it('accepte un email valide', () => {
    expect(FORMAT_EMAIL.test('kim@exemple.fr')).toBe(true);
    expect(FORMAT_EMAIL.test('kim.rothir@mail.exemple.com')).toBe(true);
  });

  it('refuse un email invalide', () => {
    expect(FORMAT_EMAIL.test('kim@exemple')).toBe(false);
    expect(FORMAT_EMAIL.test('kim@exemple.f')).toBe(false);
    expect(FORMAT_EMAIL.test('kim@mon_site.fr')).toBe(false);
    expect(FORMAT_EMAIL.test('kim exemple.fr')).toBe(false);
  });
});
