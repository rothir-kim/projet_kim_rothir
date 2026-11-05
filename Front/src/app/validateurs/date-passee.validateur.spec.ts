import { FormControl } from '@angular/forms';
import { dateDuJour, dateNonFuture } from './date-passee.validateur';

describe('dateNonFuture', () => {
  it('accepte aujourd\'hui et une date passée', () => {
    expect(dateNonFuture(new FormControl(dateDuJour()))).toBeNull();
    expect(dateNonFuture(new FormControl('2020-01-01'))).toBeNull();
  });

  it('refuse une date dans le futur', () => {
    expect(dateNonFuture(new FormControl('2999-01-01'))).toEqual({ dateFuture: true });
  });

  it('laisse passer un champ vide (c\'est required qui s\'en occupe)', () => {
    expect(dateNonFuture(new FormControl(''))).toBeNull();
  });
});
