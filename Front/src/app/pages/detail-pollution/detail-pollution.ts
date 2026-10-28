import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pollution } from '../../modeles/pollution.modele';
import { PollutionService } from '../../services/pollution-service';
import { lireId } from '../../utilitaires/lire-id';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';

type EtatDetail =
  | { statut: 'chargement' }
  | { statut: 'erreur'; message: string }
  | { statut: 'ok'; pollution: Pollution };

@Component({
  selector: 'app-detail-pollution',
  imports: [DatePipe, RouterLink],
  templateUrl: './detail-pollution.html',
  styleUrl: './detail-pollution.scss',
})
export class DetailPollution {
  private servicePollution = inject(PollutionService);
  private route = inject(ActivatedRoute);

  // paramMap (et pas snapshot) : la fiche se met à jour si l'id change dans l'URL.
  etat = toSignal(
    this.route.paramMap.pipe(
      map((parametres) => lireId(parametres.get('id'))),
      switchMap((id) => {
        if (id === null) {
          return of<EtatDetail>({ statut: 'erreur', message: 'Cette pollution est introuvable.' });
        }
        return this.servicePollution.obtenir(id).pipe(
          map((pollution): EtatDetail => ({ statut: 'ok', pollution })),
          catchError((erreur) =>
            of<EtatDetail>({ statut: 'erreur', message: messageErreurHttp(erreur) }),
          ),
          startWith<EtatDetail>({ statut: 'chargement' }),
        );
      }),
    ),
    { initialValue: { statut: 'chargement' } as EtatDetail },
  );

  pollution = computed(() => {
    const etat = this.etat();
    return etat.statut === 'ok' ? etat.pollution : null;
  });

  messageErreur = computed(() => {
    const etat = this.etat();
    return etat.statut === 'erreur' ? etat.message : '';
  });
}
