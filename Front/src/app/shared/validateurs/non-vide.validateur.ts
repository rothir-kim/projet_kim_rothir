import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Comme Validators.required, mais refuse aussi un texte avec seulement des espaces (comme l'API).
// On renvoie « required » pour garder les mêmes messages d'erreur.
export const nonVide: ValidatorFn = (controle: AbstractControl): ValidationErrors | null =>
  String(controle.value ?? '').trim() === '' ? { required: true } : null;
