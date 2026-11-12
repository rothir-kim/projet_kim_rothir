import { FormControl } from '@angular/forms';
import { formaterTelephone, telephoneValide } from './telephone.validateur';

describe('formaterTelephone', () => {
  it('met le numéro au format 06 12 34 56 78', () => {
    expect(formaterTelephone('0612345678')).toBe('06 12 34 56 78');
    expect(formaterTelephone('612345678')).toBe('06 12 34 56 78');
    expect(formaterTelephone('06 12 34 56 78')).toBe('06 12 34 56 78');
  });

  it('renvoie null pour un numéro invalide', () => {
    expect(formaterTelephone('12345')).toBeNull();
    expect(formaterTelephone('06abc45678')).toBeNull();
  });
});

describe('telephoneValide', () => {
  it('accepte un numéro valide', () => {
    expect(telephoneValide(new FormControl('0612345678'))).toBeNull();
  });

  it('refuse un numéro invalide', () => {
    expect(telephoneValide(new FormControl('123'))).toEqual({ telephone: true });
  });
});
