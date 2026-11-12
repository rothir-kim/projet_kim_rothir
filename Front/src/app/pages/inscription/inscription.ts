import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { IconeOeil } from '../../composants/icone-oeil/icone-oeil';
import { UserSaisie } from '../../modeles/user.modele';
import { AdresseService } from '../../services/adresse-service';
import { UserService } from '../../services/user-service';
import { champInvalide } from '../../utilitaires/champ-invalide';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';
import { dateDuJour, dateNonFuture } from '../../validateurs/date-passee.validateur';
import {
  CRITERES_MOT_DE_PASSE,
  motDePasseRobuste,
  motsDePasseIdentiques,
} from '../../validateurs/mot-de-passe.validateur';
import { FORMAT_EMAIL } from '../../validateurs/email.validateur';
import { nonVide } from '../../validateurs/non-vide.validateur';
import { formaterTelephone, telephoneValide } from '../../validateurs/telephone.validateur';

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, RouterLink, IconeOeil],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription {
  private serviceUser = inject(UserService);
  private serviceAdresse = inject(AdresseService);
  private routeur = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly dateMax = dateDuJour();
  utilisateurConnecte = this.serviceUser.utilisateurConnecte;

  motDePasseVisible = signal(false);
  confirmationVisible = signal(false);
  envoiEnCours = signal(false);
  erreur = signal('');

  formulaire = new FormGroup(
    {
      login: new FormControl('', { nonNullable: true, validators: [nonVide] }),
      motDePasse: new FormControl('', { nonNullable: true, validators: [motDePasseRobuste] }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      nom: new FormControl('', { nonNullable: true, validators: [nonVide] }),
      prenom: new FormControl('', { nonNullable: true, validators: [nonVide] }),
      adresse: new FormControl('', { nonNullable: true, validators: [nonVide] }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [nonVide, Validators.pattern(FORMAT_EMAIL)],
      }),
      telephone: new FormControl('', { nonNullable: true, validators: [nonVide, telephoneValide] }),
      dateNaissance: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, dateNonFuture],
      }),
    },
    { validators: [motsDePasseIdentiques] },
  );

  // Les critères se mettent à jour à chaque lettre tapée
  private motDePasse = toSignal(this.formulaire.controls.motDePasse.valueChanges, {
    initialValue: '',
  });

  criteres = computed(() =>
    CRITERES_MOT_DE_PASSE.map((critere) => ({
      libelle: critere.libelle,
      respecte: critere.test(this.motDePasse()),
    })),
  );

  // On attend une pause de 300 ms dans la frappe avant de chercher
  suggestionsAdresse = toSignal(
    this.formulaire.controls.adresse.valueChanges.pipe(
      debounceTime(300),
      map((texte) => texte.trim()),
      distinctUntilChanged(),
      switchMap((texte) => (texte.length < 3 ? of<string[]>([]) : this.serviceAdresse.suggerer(texte))),
    ),
    { initialValue: [] as string[] },
  );

  invalide = champInvalide;

  confirmationInvalide(): boolean {
    const confirmation = this.formulaire.controls.confirmation;
    return confirmation.touched && (confirmation.invalid || this.formulaire.hasError('confirmationDifferente'));
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaire.getRawValue();
    const telephone = formaterTelephone(valeurs.telephone);
    if (telephone === null) {
      return;
    }
    const saisie: UserSaisie = {
      login: valeurs.login.trim(),
      motDePasse: valeurs.motDePasse,
      nom: valeurs.nom.trim(),
      prenom: valeurs.prenom.trim(),
      adresse: valeurs.adresse.trim(),
      email: valeurs.email.trim(),
      telephone,
      dateNaissance: valeurs.dateNaissance,
    };

    this.erreur.set('');
    this.envoiEnCours.set(true);
    this.serviceUser
      .ajouter(saisie)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Un visiteur doit d'abord se connecter, la liste des utilisateurs lui est fermée
          if (this.utilisateurConnecte()) {
            this.routeur.navigate(['/utilisateurs']);
          } else {
            this.routeur.navigate(['/connexion'], { queryParams: { inscription: 'ok' } });
          }
        },
        error: (erreur) => {
          this.envoiEnCours.set(false);
          this.erreur.set(messageErreurHttp(erreur));
        },
      });
  }
}
