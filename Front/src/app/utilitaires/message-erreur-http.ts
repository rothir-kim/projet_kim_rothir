import { HttpErrorResponse } from '@angular/common/http';

export function messageErreurHttp(erreur: unknown): string {
  if (!(erreur instanceof HttpErrorResponse)) {
    return 'Une erreur inattendue est survenue.';
  }
  switch (erreur.status) {
    case 0:
      // 0 = le serveur n'a pas répondu (pas de connexion, ou Render qui démarre).
      return 'Serveur injoignable. Il démarre peut-être : réessayez dans quelques secondes.';
    case 400:
      return 'Les données envoyées sont invalides. Vérifiez les champs du formulaire.';
    case 404:
      return "Cette pollution n'existe pas ou a été supprimée.";
    default:
      return 'Erreur du serveur. Réessayez plus tard.';
  }
}
