import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserSaisie } from '../modeles/user.modele';

const CLE_STOCKAGE = 'utilisateurConnecte';

// Relit l'utilisateur gardé dans le navigateur (null si personne n'est connecté)
function lireUtilisateurStocke(): User | null {
  try {
    const texte = localStorage.getItem(CLE_STOCKAGE);
    return texte ? (JSON.parse(texte) as User) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}/users`;
  private connecte = signal<User | null>(lireUtilisateurStocke());

  readonly utilisateurConnecte = this.connecte.asReadonly();

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
    return this.http.post<User>(`${this.urlBase}/login`, { login, motDePasse }).pipe(
      tap((utilisateur) => {
        this.connecte.set(utilisateur);
        localStorage.setItem(CLE_STOCKAGE, JSON.stringify(utilisateur));
      }),
    );
  }

  deconnecter(): void {
    this.connecte.set(null);
    localStorage.removeItem(CLE_STOCKAGE);
  }
}
