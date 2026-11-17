import { Routes } from '@angular/router';
import { inviteGuard } from '../../core/guards/invite.guard';
import { Connexion } from './connexion/connexion';
import { Inscription } from './inscription/inscription';

/** Routes de connexion et d'inscription, chargées seulement quand on en a besoin. */
export const AUTH_ROUTES: Routes = [
  { path: 'connexion', component: Connexion, canActivate: [inviteGuard] },
  { path: 'inscription', component: Inscription },
];
