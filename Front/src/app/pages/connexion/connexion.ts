import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconeOeil } from '../../composants/icone-oeil/icone-oeil';
import { UserService } from '../../services/user-service';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';
import { nonVide } from '../../validateurs/non-vide.validateur';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterLink, IconeOeil],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {
  private serviceUser = inject(UserService);
  private routeur = inject(Router);
  private destroyRef = inject(DestroyRef);

  motDePasseVisible = signal(false);
  envoiEnCours = signal(false);
  erreur = signal('');

  formulaire = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [nonVide] }),
    motDePasse: new FormControl('', { nonNullable: true, validators: [nonVide] }),
  });

  invalide(controle: AbstractControl): boolean {
    return controle.invalid && controle.touched;
  }

  seConnecter(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const { login, motDePasse } = this.formulaire.getRawValue();

    this.erreur.set('');
    this.envoiEnCours.set(true);
    this.serviceUser
      .connecter(login.trim(), motDePasse)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.routeur.navigate(['/pollutions']),
        error: (erreur) => {
          this.envoiEnCours.set(false);
          this.erreur.set(messageErreurHttp(erreur));
        },
      });
  }
}
