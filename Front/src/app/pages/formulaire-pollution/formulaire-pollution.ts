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
import { urlPhotoValide } from '../../validateurs/url-photo.validateur';
import { dateDuJour, dateNonFuture } from '../../validateurs/date-passee.validateur';

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
  private idParametre = inject(ActivatedRoute).snapshot.paramMap.get('id');

  readonly types = TYPES_POLLUTION;
  readonly dateMax = dateDuJour();
  readonly id = this.idParametre === null ? null : Number(this.idParametre);
  readonly modeEdition = this.id !== null;

  envoiEnCours = signal(false);
  erreur = signal('');

  formulaire = new FormGroup({
    titre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<TypePollution | null>(null, [Validators.required]),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required, dateNonFuture] }),
    lieu: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
    if (this.id !== null) {
      this.servicePollution
        .obtenir(this.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (pollution) =>
            this.formulaire.patchValue({ ...pollution, urlPhoto: pollution.urlPhoto ?? '' }),
          error: () => this.erreur.set('Cette pollution est introuvable.'),
        });
    }
  }

  invalide(controle: AbstractControl): boolean {
    return controle.invalid && controle.touched;
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const { type, latitude, longitude, urlPhoto, ...reste } = this.formulaire.getRawValue();
    if (type === null || latitude === null || longitude === null) {
      return;
    }
    const urlPhotoNettoyee = urlPhoto.trim();
    const saisie: PollutionSaisie = {
      ...reste,
      type,
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
      error: () => {
        this.envoiEnCours.set(false);
        this.erreur.set("L'enregistrement a échoué. Veuillez réessayer.");
      },
    });
  }
}
