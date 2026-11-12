import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { UserService } from '../services/user-service';

// Laisse passer si quelqu'un est connecté, sinon renvoie vers la connexion en retenant la page demandée
function exigerConnexion(pageDemandee: string): true | UrlTree {
  if (inject(UserService).utilisateurConnecte()) {
    return true;
  }
  return inject(Router).createUrlTree(['/connexion'], { queryParams: { retour: pageDemandee } });
}

/** Protège une page : il faut être connecté pour l'ouvrir. */
export const connexionGuard: CanActivateFn = (_route, etat) => exigerConnexion(etat.url);

/** Protège toute une partie de l'appli : son code n'est même pas téléchargé sans connexion. */
export const connexionMatchGuard: CanMatchFn = (_route, segments) =>
  exigerConnexion('/' + segments.map((segment) => segment.path).join('/'));
