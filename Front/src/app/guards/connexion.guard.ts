import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';

// Laisse passer si quelqu'un est connecté, sinon renvoie vers la page de connexion
export const connexionGuard: CanActivateFn = () => {
  const serviceUser = inject(UserService);
  const routeur = inject(Router);
  return serviceUser.utilisateurConnecte() ? true : routeur.createUrlTree(['/connexion']);
};
