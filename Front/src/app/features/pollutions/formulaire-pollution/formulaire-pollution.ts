import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AvecModificationsNonEnregistrees } from '../../../core/guards/modifications-non-enregistrees.guard';
import { HighlightPollutionDirective } from '../../../shared/directives/highlight-pollution.directive';
import { PollutionSaisie, TYPES_POLLUTION, TypePollution } from '../../../core/modeles/pollution.modele';
import { PollutionLevelPipe } from '../../../shared/pipes/pollution-level.pipe';
import { PollutionService } from '../../../core/services/pollution-service';
import { UserService } from '../../../core/services/user-service';
import { champInvalide } from '../../../shared/utilitaires/champ-invalide';
import { lireId } from '../../../shared/utilitaires/lire-id';
import { messageErreurHttp } from '../../../shared/utilitaires/message-erreur-http';
import { dateDuJour, dateNonFuture } from '../../../shared/validateurs/date-passee.validateur';
import { nonVide } from '../../../shared/validateurs/non-vide.validateur';
import { urlPhotoValide } from '../../../shared/validateurs/url-photo.validateur';

@Component({
  selector: 'app-formulaire-pollution',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './formulaire-pollution.html',
  styleUrl: './formulaire-pollution.scss',
})
export class FormulairePollution implements AvecModificationsNonEnregistrees {
  private servicePollution = inject(PollutionService);
  private serviceUser = inject(UserService);
  private routeur = inject(Router);
  private destroyRef = inject(DestroyRef);
  // Le snapshot suffit : « nouvelle » et « modifier » sont deux routes différentes,
  // donc le composant est recréé à chaque fois.
  private idParametre = inject(ActivatedRoute).snapshot.paramMap.get('id');

  readonly types = TYPES_POLLUTION;
  readonly dateMax = dateDuJour();
  readonly modeEdition = this.idParametre !== null;
  readonly id = lireId(this.idParametre);

  private enregistrementReussi = false;

  envoiEnCours = signal(false);
  erreur = signal('');
  introuvable = signal(false);

  formulaire = new FormGroup({
    titre: new FormControl('', { nonNullable: true, validators: [nonVide] }),
    type: new FormControl<TypePollution | null>(null, [Validators.required]),
    description: new FormControl('', { nonNullable: true, validators: [nonVide] }),
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, dateNonFuture],
    }),
    lieu: new FormControl('', { nonNullable: true, validators: [nonVide] }),
    latitude: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(-90),
      Validators.max(90),
    ]),
    longitude: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(-180),
      Validators.max(180),
    ]),
    indiceDangerosite: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(150),
      Validators.pattern(/^[0-9]+$/),
    ]),
    urlPhoto: new FormControl('', { nonNullable: true, validators: [urlPhotoValide] }),
  });

  // Le flux des valeurs du curseur devient un signal : l'affichage suit, même avec OnPush
  indice = toSignal(this.formulaire.controls.indiceDangerosite.valueChanges, {
    initialValue: this.formulaire.controls.indiceDangerosite.value,
  });

  constructor() {
    if (!this.modeEdition) {
      return;
    }
    if (this.id === null) {
      // Id invalide dans l'URL (ex : /pollutions/abc/modifier).
      this.introuvable.set(true);
      this.erreur.set('Cette pollution est introuvable.');
      return;
    }
    this.servicePollution
      .obtenir(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pollution) =>
          this.formulaire.patchValue({ ...pollution, urlPhoto: pollution.urlPhoto ?? '' }),
        error: (erreur) => {
          this.introuvable.set(true);
          this.erreur.set(messageErreurHttp(erreur));
        },
      });
  }

  invalide = champInvalide;

  // Le curseur écrit dans le champ : la case à taper et l'étiquette suivent
  choisirIndice(valeur: number): void {
    const champ = this.formulaire.controls.indiceDangerosite;
    champ.setValue(valeur);
    champ.markAsDirty();
  }

  aDesModificationsNonEnregistrees(): boolean {
    return this.formulaire.dirty && !this.enregistrementReussi;
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const {
      titre,
      type,
      description,
      date,
      lieu,
      latitude,
      longitude,
      indiceDangerosite,
      urlPhoto,
    } = this.formulaire.getRawValue();
    if (type === null || indiceDangerosite === null || latitude === null || longitude === null) {
      return;
    }
    const saisie: PollutionSaisie = {
      titre: titre.trim(),
      type,
      description: description.trim(),
      date,
      lieu: lieu.trim(),
      latitude,
      longitude,
      indiceDangerosite,
      urlPhoto: urlPhoto.trim() || null,
    };
    // La page est protégée par le guard : il y a toujours quelqu'un de connecté ici
    const auteurId = this.serviceUser.utilisateurConnecte()?.id ?? 0;
    const requete =
      this.id === null
        ? this.servicePollution.ajouter(saisie, auteurId)
        : this.servicePollution.modifier(this.id, saisie);

    this.erreur.set('');
    this.envoiEnCours.set(true);
    requete.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      // On affiche la fiche de la pollution qui vient d'être enregistrée
      next: (pollution) => {
        this.enregistrementReussi = true;
        this.routeur.navigate(['/pollutions', pollution.id]);
      },
      error: (erreur) => {
        this.envoiEnCours.set(false);
        this.erreur.set(messageErreurHttp(erreur));
      },
    });
  }
}
