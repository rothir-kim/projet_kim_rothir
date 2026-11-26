import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { User } from '../modeles/user.modele';
import { Login } from '../states/auth/auth.actions';
import { AuthState } from '../states/auth/auth.state';
import { Entete } from './entete';

@Component({ template: '' })
class PageVide {}

const utilisateur = { id: 1, nom: 'Dupont', prenom: 'Jean' } as User;

describe('Entete : déconnexion', () => {
  let store: Store;
  let routeur: Router;
  let autoriserSortie = true;

  beforeEach(() => {
    autoriserSortie = true;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideStore([AuthState]),
        provideRouter([
          { path: 'pollutions', component: PageVide },
          { path: 'pollutions/:id', component: PageVide },
          { path: 'formulaire', component: PageVide, canDeactivate: [() => autoriserSortie] },
        ]),
      ],
    });
    store = TestBed.inject(Store);
    routeur = TestBed.inject(Router);
    store.dispatch(new Login(utilisateur));
  });

  async function cliquerSurDeconnexion(): Promise<void> {
    TestBed.createComponent(Entete).componentInstance.seDeconnecter();
    await new Promise((resolve) => setTimeout(resolve));
  }

  const connecte = () => store.selectSnapshot(AuthState.isAuthenticated);

  it('déconnecte depuis la liste /pollutions', async () => {
    await routeur.navigateByUrl('/pollutions');
    await cliquerSurDeconnexion();

    expect(connecte()).toBe(false);
  });

  it('déconnecte depuis une fiche et revient à la liste', async () => {
    await routeur.navigateByUrl('/pollutions/3');
    await cliquerSurDeconnexion();

    expect(connecte()).toBe(false);
    expect(routeur.url).toBe('/pollutions');
  });

  it('déconnecte depuis la liste avec un paramètre dans l’adresse', async () => {
    await routeur.navigateByUrl('/pollutions?page=2');
    await cliquerSurDeconnexion();

    expect(connecte()).toBe(false);
  });

  it('déconnecte depuis un formulaire qui laisse partir', async () => {
    await routeur.navigateByUrl('/formulaire');
    await cliquerSurDeconnexion();

    expect(connecte()).toBe(false);
  });

  it('ne déconnecte pas si la page refuse d’être quittée', async () => {
    await routeur.navigateByUrl('/formulaire');
    autoriserSortie = false;
    await cliquerSurDeconnexion();

    expect(connecte()).toBe(true);
    expect(routeur.url).toBe('/formulaire');
  });
});
