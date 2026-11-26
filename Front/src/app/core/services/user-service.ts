import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserSaisie } from '../modeles/user.modele';
import { Login, Logout } from '../states/auth/auth.actions';
import { AuthState } from '../states/auth/auth.state';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private urlBase = `${environment.apiUrl}/users`;

  // L'utilisateur connecté est gardé dans le store
  readonly utilisateurConnecte = this.store.selectSignal(AuthState.user);

  lister(): Observable<User[]> {
    return this.http.get<User[]>(this.urlBase);
  }

  ajouter(utilisateur: UserSaisie): Observable<User> {
    return this.http.post<User>(this.urlBase, utilisateur);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }

  connecter(login: string, motDePasse: string): Observable<User> {
    return this.http
      .post<User>(`${this.urlBase}/login`, { login, motDePasse })
      .pipe(tap((utilisateur) => this.store.dispatch(new Login(utilisateur))));
  }

  deconnecter(): void {
    this.store.dispatch(new Logout());
  }
}
