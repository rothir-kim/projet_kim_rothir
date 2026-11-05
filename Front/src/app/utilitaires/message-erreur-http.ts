import { HttpErrorResponse } from '@angular/common/http';

// Pour une erreur 400, l'API explique ce qui ne va pas dans « details »
function detailsApi(erreur: HttpErrorResponse): string | null {
  const details: unknown = erreur.error?.details;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(' · ');
  }
  return null;
}

export function messageErreurHttp(erreur: unknown): string {
  if (!(erreur instanceof HttpErrorResponse)) {
    return 'Une erreur inattendue est survenue.';
  }
  switch (erreur.status) {
    case 0:
      // 0 = le serveur n'a pas répondu (pas de connexion, ou Render qui démarre).
      return 'Serveur injoignable. Il démarre peut-être : réessayez dans quelques secondes.';
    case 400:
      return detailsApi(erreur) ?? 'Les données envoyées sont invalides. Vérifiez les champs du formulaire.';
    case 401:
      return 'Login ou mot de passe incorrect.';
    case 404:
      return "L'élément demandé n'existe pas ou a été supprimé.";
    case 409:
      return 'Ce login ou cet email est déjà utilisé.';
    default:
      return 'Erreur du serveur. Réessayez plus tard.';
  }
}
