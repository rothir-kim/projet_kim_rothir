import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pollution } from '../../modeles/pollution.modele';
import { PollutionService } from '../../services/pollution-service';
import { UserService } from '../../services/user-service';
import { lireId } from '../../utilitaires/lire-id';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';

@Component({
  selector: 'app-detail-pollution',
  imports: [DatePipe, RouterLink],
  templateUrl: './detail-pollution.html',
  styleUrl: './detail-pollution.scss',
})
export class DetailPollution {
  private servicePollution = inject(PollutionService);
  private destroyRef = inject(DestroyRef);
  private id = lireId(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  utilisateurConnecte = inject(UserService).utilisateurConnecte;

  pollution = signal<Pollution | null>(null);
  messageErreur = signal('');

  constructor() {
    if (this.id === null) {
      this.messageErreur.set('Cette pollution est introuvable.');
      return;
    }
    this.servicePollution
      .obtenir(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pollution) => this.pollution.set(pollution),
        error: (erreur) => this.messageErreur.set(messageErreurHttp(erreur)),
      });
  }
}
