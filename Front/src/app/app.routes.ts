import { Routes } from '@angular/router';
import { DetailPollution } from './pages/detail-pollution/detail-pollution';
import { FormulairePollution } from './pages/formulaire-pollution/formulaire-pollution';
import { ListePollutions } from './pages/liste-pollutions/liste-pollutions';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'pollutions', component: ListePollutions },
  { path: 'pollutions/nouvelle', component: FormulairePollution },
  { path: 'pollutions/:id', component: DetailPollution },
  { path: 'pollutions/:id/modifier', component: FormulairePollution },
  { path: '**', redirectTo: 'pollutions' },
];
