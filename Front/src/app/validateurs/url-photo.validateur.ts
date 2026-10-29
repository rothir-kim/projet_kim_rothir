import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const urlPhotoValide: ValidatorFn = (
  controle: AbstractControl,
): ValidationErrors | null => {
  const valeur = String(controle.value ?? '').trim();
  if (valeur === '') {
    return null;
  }
  try {
    const { protocol } = new URL(valeur);
    return protocol === 'http:' || protocol === 'https:' ? null : { urlPhoto: true };
  } catch {
    return { urlPhoto: true };
  }
};
