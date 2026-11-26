import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../states/auth/auth.state';

/** Réservé aux visiteurs : une personne déjà connectée est renvoyée vers la liste. */
export const inviteGuard: CanActivateFn = () =>
  inject(Store).selectSnapshot(AuthState.isAuthenticated) ? inject(Router).createUrlTree(['/pollutions']) : true;
