import { HttpErrorResponse } from '@angular/common/http';
import { messageErreurHttp } from './message-erreur-http';

describe('messageErreurHttp', () => {
  it('affiche les détails envoyés par l\'API pour une erreur 400', () => {
    const erreur = new HttpErrorResponse({
      status: 400,
      error: { message: 'Données invalides', details: ['Le titre est requis'] },
    });
    expect(messageErreurHttp(erreur)).toBe('Le titre est requis');
  });

  it('garde un message général si l\'API ne donne pas de détails', () => {
    const erreur = new HttpErrorResponse({ status: 400 });
    expect(messageErreurHttp(erreur)).toContain('invalides');
  });

  it('prévient quand le serveur ne répond pas', () => {
    expect(messageErreurHttp(new HttpErrorResponse({ status: 0 }))).toContain('injoignable');
  });
});
