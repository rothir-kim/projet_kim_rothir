import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CartePollution } from '../../composants/carte-pollution/carte-pollution';
import { FiltresPollution } from '../../composants/filtres-pollution/filtres-pollution';
import { FILTRES_VIDES, Filtres } from '../../modeles/filtres.modele';
import { Pollution } from '../../modeles/pollution.modele';
import { PollutionService } from '../../services/pollution-service';
import { filtrerPollutions } from '../../utilitaires/filtrer-pollutions';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';

type EtatListe =
  | { statut: 'chargement' }
  | { statut: 'erreur'; message: string }
  | { statut: 'ok'; pollutions: Pollution[] };

@Component({
  selector: 'app-liste-pollutions',
  imports: [RouterLink, CartePollution, FiltresPollution],
  templateUrl: './liste-pollutions.html',
  styleUrl: './liste-pollutions.scss',
})
export class ListePollutions {
  private servicePollution = inject(PollutionService);
  private destroyRef = inject(DestroyRef);
  private rechargement = signal(0);

  erreurSuppression = signal('');
  filtres = signal<Filtres>({ ...FILTRES_VIDES });

  // Chaque fois que la liste se recharge, on affiche « Chargement… », puis la liste ou un message d'erreur.
  etat = toSignal(
    toObservable(this.rechargement).pipe(
      switchMap(() =>
        this.servicePollution.lister().pipe(
          map((pollutions): EtatListe => ({ statut: 'ok', pollutions })),
          catchError((erreur) =>
            of<EtatListe>({ statut: 'erreur', message: messageErreurHttp(erreur) }),
          ),
          startWith<EtatListe>({ statut: 'chargement' }),
        ),
      ),
    ),
    { initialValue: { statut: 'chargement' } as EtatListe },
  );

  messageErreur = computed(() => {
    const etat = this.etat();
    return etat.statut === 'erreur' ? etat.message : '';
  });

  pollutionsFiltrees = computed(() => {
    const etat = this.etat();
    return etat.statut === 'ok' ? filtrerPollutions(etat.pollutions, this.filtres()) : [];
  });

  recharger(): void {
    this.rechargement.update((compteur) => compteur + 1);
  }

  supprimer(id: number): void {
    this.erreurSuppression.set('');
    this.servicePollution
      .supprimer(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.recharger(),
        error: (erreur) => this.erreurSuppression.set(messageErreurHttp(erreur)),
      });
  }
}
