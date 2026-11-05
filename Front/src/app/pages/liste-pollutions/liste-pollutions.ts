import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CartePollution } from '../../composants/carte-pollution/carte-pollution';
import { FiltresPollution } from '../../composants/filtres-pollution/filtres-pollution';
import { FILTRES_VIDES, Filtres } from '../../modeles/filtres.modele';
import { Pollution, TYPES_POLLUTION } from '../../modeles/pollution.modele';
import { PollutionService } from '../../services/pollution-service';
import { UserService } from '../../services/user-service';
import { filtrerPollutions } from '../../utilitaires/filtrer-pollutions';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';

@Component({
  selector: 'app-liste-pollutions',
  imports: [RouterLink, CartePollution, FiltresPollution],
  templateUrl: './liste-pollutions.html',
  styleUrl: './liste-pollutions.scss',
})
export class ListePollutions {
  private servicePollution = inject(PollutionService);
  private destroyRef = inject(DestroyRef);

  utilisateurConnecte = inject(UserService).utilisateurConnecte;
  readonly types = TYPES_POLLUTION;

  pollutions = signal<Pollution[]>([]);
  chargement = signal(true);
  erreur = signal('');
  erreurSuppression = signal('');
  filtres = signal<Filtres>({ ...FILTRES_VIDES });

  pollutionsFiltrees = computed(() => filtrerPollutions(this.pollutions(), this.filtres()));

  constructor() {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set('');
    this.erreurSuppression.set('');
    this.servicePollution
      .lister()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pollutions) => {
          this.pollutions.set(pollutions);
          this.chargement.set(false);
        },
        error: (erreur) => {
          this.erreur.set(messageErreurHttp(erreur));
          this.chargement.set(false);
        },
      });
  }

  supprimer(id: number): void {
    this.erreurSuppression.set('');
    this.servicePollution
      .supprimer(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.charger(),
        error: (erreur) => this.erreurSuppression.set(messageErreurHttp(erreur)),
      });
  }
}
