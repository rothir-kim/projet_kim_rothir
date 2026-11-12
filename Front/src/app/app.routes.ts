import { Routes } from '@angular/router';

// Chaque partie de l'appli est téléchargée seulement quand on y va (lazy loading)
export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  {
    path: 'pollutions',
    loadChildren: () =>
      import('./features/pollutions/pollution.routes').then((m) => m.POLLUTION_ROUTES),
  },
  {
    path: 'utilisateurs',
    loadChildren: () =>
      import('./features/utilisateurs/utilisateur.routes').then((m) => m.UTILISATEUR_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: 'pollutions' },
];
