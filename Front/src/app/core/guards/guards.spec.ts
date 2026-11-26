import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment, UrlTree, provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { User } from '../modeles/user.modele';
import { Login, Logout } from '../states/auth/auth.actions';
import { AuthState } from '../states/auth/auth.state';
import { connexionGuard, connexionMatchGuard } from './connexion.guard';
import { inviteGuard } from './invite.guard';

const utilisateur = { id: 1, nom: 'Dupont', prenom: 'Jean' } as User;

function executer<T>(fn: () => T): T {
  return TestBed.runInInjectionContext(fn);
}

describe('guards d’authentification', () => {
  let store: Store;
  let routeur: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideStore([AuthState])] });
    store = TestBed.inject(Store);
    routeur = TestBed.inject(Router);
  });

  it('connexionGuard renvoie vers /connexion en retenant la page si déconnecté', () => {
    const resultat = executer(() => connexionGuard({} as never, { url: '/utilisateurs' } as never));

    expect(resultat).toBeInstanceOf(UrlTree);
    expect(routeur.serializeUrl(resultat as UrlTree)).toBe('/connexion?retour=%2Futilisateurs');
  });

  it('connexionGuard laisse passer si connecté', () => {
    store.dispatch(new Login(utilisateur));

    expect(executer(() => connexionGuard({} as never, { url: '/utilisateurs' } as never))).toBe(true);
  });

  it('connexionGuard bloque de nouveau après une déconnexion', () => {
    store.dispatch(new Login(utilisateur));
    store.dispatch(new Logout());

    expect(executer(() => connexionGuard({} as never, { url: '/x' } as never))).toBeInstanceOf(UrlTree);
  });

  it('connexionMatchGuard reconstruit l’adresse demandée', () => {
    const resultat = executer(() =>
      connexionMatchGuard({} as never, [new UrlSegment('utilisateurs', {}), new UrlSegment('3', {})], {} as never),
    );

    expect(routeur.serializeUrl(resultat as UrlTree)).toBe('/connexion?retour=%2Futilisateurs%2F3');
  });

  it('connexionMatchGuard laisse passer si connecté', () => {
    store.dispatch(new Login(utilisateur));

    expect(executer(() => connexionMatchGuard({} as never, [], {} as never))).toBe(true);
  });

  it('inviteGuard laisse passer un visiteur', () => {
    expect(executer(() => inviteGuard({} as never, {} as never))).toBe(true);
  });

  it('inviteGuard renvoie un utilisateur connecté vers /pollutions', () => {
    store.dispatch(new Login(utilisateur));
    const resultat = executer(() => inviteGuard({} as never, {} as never));

    expect(routeur.serializeUrl(resultat as UrlTree)).toBe('/pollutions');
  });
});
