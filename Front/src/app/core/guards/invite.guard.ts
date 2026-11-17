import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';

/** Réservé aux visiteurs : une personne déjà connectée est renvoyée vers la liste. */
export const inviteGuard: CanActivateFn = () =>
  inject(UserService).utilisateurConnecte() ? inject(Router).createUrlTree(['/pollutions']) : true;
