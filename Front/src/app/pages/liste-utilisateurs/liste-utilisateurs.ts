import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../modeles/user.modele';
import { UserService } from '../../services/user-service';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';

@Component({
  selector: 'app-liste-utilisateurs',
  imports: [DatePipe, RouterLink],
  templateUrl: './liste-utilisateurs.html',
  styleUrl: './liste-utilisateurs.scss',
})
export class ListeUtilisateurs {
  private serviceUser = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private routeur = inject(Router);

  utilisateurs = signal<User[]>([]);
  chargement = signal(true);
  erreur = signal('');
  idAConfirmer = signal<number | null>(null);

  constructor() {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set('');
    this.serviceUser
      .lister()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (utilisateurs) => {
          this.utilisateurs.set(utilisateurs);
          this.chargement.set(false);
        },
        error: (erreur) => {
          this.erreur.set(messageErreurHttp(erreur));
          this.chargement.set(false);
        },
      });
  }

  supprimer(id: number): void {
    this.idAConfirmer.set(null);
    this.erreur.set('');
    this.serviceUser
      .supprimer(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Si on supprime son propre compte, on est déconnecté
          if (this.serviceUser.utilisateurConnecte()?.id === id) {
            this.serviceUser.deconnecter();
            this.routeur.navigate(['/connexion']);
            return;
          }
          this.charger();
        },
        error: (erreur) => this.erreur.set(messageErreurHttp(erreur)),
      });
  }
}
