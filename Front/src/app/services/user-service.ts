import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserSaisie } from '../modeles/user.modele';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}/users`;

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
    return this.http.post<User>(`${this.urlBase}/login`, { login, motDePasse });
  }
}
