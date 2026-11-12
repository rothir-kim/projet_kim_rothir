import { Routes } from '@angular/router';
import { ListeUtilisateurs } from './liste-utilisateurs/liste-utilisateurs';

/** Routes de la partie utilisateurs (la connexion est vérifiée dans app.routes.ts). */
export const UTILISATEUR_ROUTES: Routes = [
  { path: '', component: ListeUtilisateurs },
];
