import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution, PollutionSaisie } from '../modeles/pollution.modele';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}/pollutions`;

  lister(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.urlBase);
  }

  obtenir(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.urlBase}/${id}`);
  }

  ajouter(pollution: PollutionSaisie): Observable<Pollution> {
    return this.http.post<Pollution>(this.urlBase, pollution);
  }

  modifier(id: number, pollution: PollutionSaisie): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.urlBase}/${id}`, pollution);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}
