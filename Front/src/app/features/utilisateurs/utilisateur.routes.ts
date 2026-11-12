import { Routes } from '@angular/router';
import { connexionGuard } from '../../core/guards/connexion.guard';
import { ListeUtilisateurs } from './liste-utilisateurs/liste-utilisateurs';

/** Routes de la partie utilisateurs, chargées seulement quand on va sur /utilisateurs. */
export const UTILISATEUR_ROUTES: Routes = [
  { path: '', component: ListeUtilisateurs, canActivate: [connexionGuard] },
];
