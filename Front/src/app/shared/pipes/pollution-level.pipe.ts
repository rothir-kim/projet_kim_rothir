import { Pipe, PipeTransform } from '@angular/core';

export type NiveauPollution = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse' | 'Inconnu';

/** Transforme un indice de dangerosité en niveau (Faible, Modérée, Élevée ou Dangereuse). */
@Pipe({
  name: 'pollutionLevel',
})
export class PollutionLevelPipe implements PipeTransform {
  transform(indice: number | null | undefined): NiveauPollution {
    if (indice === null || indice === undefined || indice < 0) {
      return 'Inconnu';
    }
    if (indice <= 20) {
      return 'Faible';
    }
    if (indice <= 50) {
      return 'Modérée';
    }
    if (indice <= 100) {
      return 'Élevée';
    }
    return 'Dangereuse';
  }
}
