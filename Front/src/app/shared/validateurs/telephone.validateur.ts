import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Renvoie le numéro au format « 06 12 34 56 78 », ou null s'il n'est pas valide
export function formaterTelephone(valeur: string): string | null {
  const chiffres = valeur.replace(/\s/g, '');
  if (!/^0?[1-9][0-9]{8}$/.test(chiffres)) {
    return null;
  }
  const avecZero = chiffres.length === 9 ? `0${chiffres}` : chiffres;
  return avecZero.replace(/(\d{2})(?=\d)/g, '$1 ');
}

export const telephoneValide: ValidatorFn = (
  controle: AbstractControl,
): ValidationErrors | null => {
  const valeur = String(controle.value ?? '');
  if (valeur.trim() === '') {
    return null;
  }
  return formaterTelephone(valeur) === null ? { telephone: true } : null;
};
