import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

interface ReponseGeocodage {
  features: { properties: { label: string } }[];
}

// Service gratuit de l'IGN qui propose des adresses françaises
@Injectable({ providedIn: 'root' })
export class AdresseService {
  private http = inject(HttpClient);
  private url = 'https://data.geopf.fr/geocodage/search';

  suggerer(texte: string): Observable<string[]> {
    const params = { q: texte, limit: 5, autocomplete: 1 };
    return this.http.get<ReponseGeocodage>(this.url, { params }).pipe(
      map((reponse) => reponse.features.map((adresse) => adresse.properties.label)),
      catchError(() => of([])),
    );
  }
}
