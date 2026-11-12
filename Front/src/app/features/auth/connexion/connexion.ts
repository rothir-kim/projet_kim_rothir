import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IconeOeil } from '../../../shared/icone-oeil/icone-oeil';
import { UserService } from '../../../core/services/user-service';
import { champInvalide } from '../../../shared/utilitaires/champ-invalide';
import { messageErreurHttp } from '../../../shared/utilitaires/message-erreur-http';
import { nonVide } from '../../../shared/validateurs/non-vide.validateur';

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

  private parametres = inject(ActivatedRoute).snapshot.queryParamMap;

  // Vrai quand on arrive ici juste après une inscription (/connexion?inscription=ok)
  readonly compteCree = this.parametres.get('inscription') === 'ok';
  // Page demandée avant d'être renvoyé ici par le guard (seulement une adresse du site)
  readonly pageDeRetour = this.lirePageDeRetour(this.parametres.get('retour'));

  motDePasseVisible = signal(false);
  envoiEnCours = signal(false);
  erreur = signal('');

  formulaire = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [nonVide] }),
    motDePasse: new FormControl('', { nonNullable: true, validators: [nonVide] }),
  });

  invalide = champInvalide;

  private lirePageDeRetour(adresse: string | null): string | null {
    return adresse?.startsWith('/') && !adresse.startsWith('//') ? adresse : null;
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
        next: () => this.routeur.navigateByUrl(this.pageDeRetour ?? '/pollutions'),
        error: (erreur) => {
          this.envoiEnCours.set(false);
          this.erreur.set(messageErreurHttp(erreur));
        },
      });
  }
}
