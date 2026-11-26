import { Routes } from '@angular/router';
import { connexionGuard } from '../../core/guards/connexion.guard';
import { modificationsNonEnregistreesGuard } from '../../core/guards/modifications-non-enregistrees.guard';
import { DetailPollution } from './detail-pollution/detail-pollution';
import { FormulairePollution } from './formulaire-pollution/formulaire-pollution';
import { ListePollutions } from './liste-pollutions/liste-pollutions';

/** Routes de la partie pollutions, chargées seulement quand on va sur /pollutions. */
export const POLLUTION_ROUTES: Routes = [
  { path: '', component: ListePollutions },
  {
    path: 'nouvelle',
    component: FormulairePollution,
    canActivate: [connexionGuard],
    canDeactivate: [modificationsNonEnregistreesGuard],
  },
  { path: ':id', component: DetailPollution },
  {
    path: ':id/modifier',
    component: FormulairePollution,
    canActivate: [connexionGuard],
    canDeactivate: [modificationsNonEnregistreesGuard],
  },
];
