import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { describe, expect, it, beforeEach } from 'vitest';
import { User } from '../../modeles/user.modele';
import { Login, Logout } from './auth.actions';
import { AuthState } from './auth.state';

const utilisateur: User = {
  id: 1,
  login: 'jdupont',
  nom: 'Dupont',
  prenom: 'Jean',
  adresse: '1 rue de Paris',
  email: 'jean@exemple.fr',
  telephone: '0102030405',
  dateNaissance: '1990-01-01',
};

describe('AuthState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideStore([AuthState])] });
    store = TestBed.inject(Store);
  });

  it('démarre déconnecté', () => {
    expect(store.selectSnapshot(AuthState.isAuthenticated)).toBe(false);
    expect(store.selectSnapshot(AuthState.user)).toBeNull();
    expect(store.selectSnapshot(AuthState.username)).toBe('');
  });

  it('Login connecte l’utilisateur', () => {
    store.dispatch(new Login(utilisateur));

    expect(store.selectSnapshot(AuthState.isAuthenticated)).toBe(true);
    expect(store.selectSnapshot(AuthState.user)).toEqual(utilisateur);
    expect(store.selectSnapshot(AuthState.username)).toBe('Jean Dupont');
  });

  it('Logout remet l’état initial', () => {
    store.dispatch(new Login(utilisateur));
    store.dispatch(new Logout());

    expect(store.selectSnapshot(AuthState.isAuthenticated)).toBe(false);
    expect(store.selectSnapshot(AuthState.user)).toBeNull();
  });
});
