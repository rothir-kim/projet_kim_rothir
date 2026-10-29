import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollutionSaisie, TYPES_POLLUTION, TypePollution } from '../../modeles/pollution.modele';
import { PollutionService } from '../../services/pollution-service';
import { lireId } from '../../utilitaires/lire-id';
import { messageErreurHttp } from '../../utilitaires/message-erreur-http';
import { dateDuJour, dateNonFuture } from '../../validateurs/date-passee.validateur';
import { nonVide } from '../../validateurs/non-vide.validateur';
import { urlPhotoValide } from '../../validateurs/url-photo.validateur';

@Component({
  selector: 'app-formulaire-pollution',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulaire-pollution.html',
  styleUrl: './formulaire-pollution.scss',
})
export class FormulairePollution {
  private servicePollution = inject(PollutionService);
  private routeur = inject(Router);
  private destroyRef = inject(DestroyRef);
  // Le snapshot suffit : « nouvelle » et « modifier » sont deux routes différentes,
  // donc le composant est recréé à chaque fois.
  private idParametre = inject(ActivatedRoute).snapshot.paramMap.get('id');

  readonly types = TYPES_POLLUTION;
  readonly dateMax = dateDuJour();
  readonly modeEdition = this.idParametre !== null;
  readonly id = lireId(this.idParametre);

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
    urlPhoto: new FormControl('', { nonNullable: true, validators: [urlPhotoValide] }),
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

  invalide(controle: AbstractControl): boolean {
    return controle.invalid && controle.touched;
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const { titre, type, description, date, lieu, latitude, longitude, urlPhoto } =
      this.formulaire.getRawValue();
    if (type === null || latitude === null || longitude === null) {
      return;
    }
    const urlPhotoNettoyee = urlPhoto.trim();
    const saisie: PollutionSaisie = {
      titre: titre.trim(),
      type,
      description: description.trim(),
      date,
      lieu: lieu.trim(),
      latitude,
      longitude,
      ...(urlPhotoNettoyee ? { urlPhoto: urlPhotoNettoyee } : {}),
    };
    const requete =
      this.id === null
        ? this.servicePollution.ajouter(saisie)
        : this.servicePollution.modifier(this.id, saisie);

    this.erreur.set('');
    this.envoiEnCours.set(true);
    requete.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.routeur.navigate(['/pollutions']),
      error: (erreur) => {
        this.envoiEnCours.set(false);
        this.erreur.set(messageErreurHttp(erreur));
      },
    });
  }
}
