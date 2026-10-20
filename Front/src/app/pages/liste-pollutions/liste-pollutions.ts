import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { CartePollution } from '../../composants/carte-pollution/carte-pollution';
import { FiltresPollution } from '../../composants/filtres-pollution/filtres-pollution';
import { FILTRES_VIDES, Filtres } from '../../modeles/filtres.modele';
import { Pollution } from '../../modeles/pollution.modele';
import { PollutionService } from '../../services/pollution-service';
import { filtrerPollutions } from '../../utilitaires/filtrer-pollutions';

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

  chargement = signal(true);
  erreurChargement = signal('');
  erreurSuppression = signal('');
  filtres = signal<Filtres>({ ...FILTRES_VIDES });

  pollutions = toSignal(
    toObservable(this.rechargement).pipe(
      tap(() => {
        this.chargement.set(true);
        this.erreurChargement.set('');
      }),
      switchMap(() =>
        this.servicePollution.lister().pipe(
          catchError(() => {
            this.erreurChargement.set(
              'Impossible de charger les pollutions. Le serveur démarre peut-être : réessayez dans quelques secondes.',
            );
            return of<Pollution[]>([]);
          }),
        ),
      ),
      tap(() => this.chargement.set(false)),
    ),
    { initialValue: [] as Pollution[] },
  );

  pollutionsFiltrees = computed(() => filtrerPollutions(this.pollutions(), this.filtres()));

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
        error: () => this.erreurSuppression.set('La suppression a échoué. Veuillez réessayer.'),
      });
  }
}
