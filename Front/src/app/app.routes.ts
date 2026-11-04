import { Routes } from '@angular/router';
import { connexionGuard } from './guards/connexion.guard';
import { Connexion } from './pages/connexion/connexion';
import { DetailPollution } from './pages/detail-pollution/detail-pollution';
import { FormulairePollution } from './pages/formulaire-pollution/formulaire-pollution';
import { Inscription } from './pages/inscription/inscription';
import { ListePollutions } from './pages/liste-pollutions/liste-pollutions';
import { ListeUtilisateurs } from './pages/liste-utilisateurs/liste-utilisateurs';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'pollutions', component: ListePollutions },
  { path: 'pollutions/nouvelle', component: FormulairePollution, canActivate: [connexionGuard] },
  { path: 'pollutions/:id', component: DetailPollution },
  {
    path: 'pollutions/:id/modifier',
    component: FormulairePollution,
    canActivate: [connexionGuard],
  },
  { path: 'utilisateurs', component: ListeUtilisateurs, canActivate: [connexionGuard] },
  { path: 'inscription', component: Inscription },
  { path: 'connexion', component: Connexion },
  { path: '**', redirectTo: 'pollutions' },
];
