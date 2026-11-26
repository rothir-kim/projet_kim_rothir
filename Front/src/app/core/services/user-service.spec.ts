import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { User } from '../modeles/user.modele';
import { AuthState } from '../states/auth/auth.state';
import { UserService } from './user-service';

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

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([AuthState], withNgxsStoragePlugin({ keys: ['auth'] })),
      ],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  it('personne n’est connecté au départ', () => {
    expect(service.utilisateurConnecte()).toBeNull();
  });

  it('connecter garde l’utilisateur et le persiste dans le localStorage', () => {
    service.connecter('jdupont', 'secret').subscribe();
    http.expectOne(`${environment.apiUrl}/users/login`).flush(utilisateur);

    expect(service.utilisateurConnecte()).toEqual(utilisateur);
    expect(JSON.parse(localStorage.getItem('auth')!).user).toEqual(utilisateur);
  });

  it('une connexion refusée ne connecte personne', () => {
    service.connecter('jdupont', 'faux').subscribe({ error: () => undefined });
    http
      .expectOne(`${environment.apiUrl}/users/login`)
      .flush({ message: 'Identifiants invalides' }, { status: 401, statusText: 'Unauthorized' });

    expect(service.utilisateurConnecte()).toBeNull();
  });

  it('deconnecter vide l’utilisateur et le localStorage', () => {
    service.connecter('jdupont', 'secret').subscribe();
    http.expectOne(`${environment.apiUrl}/users/login`).flush(utilisateur);

    service.deconnecter();

    expect(service.utilisateurConnecte()).toBeNull();
    const stocke = JSON.parse(localStorage.getItem('auth')!);
    expect(stocke.user).toBeNull();
    expect(stocke.isAuthenticated).toBe(false);
  });
});
