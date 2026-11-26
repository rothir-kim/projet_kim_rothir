import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Date du jour à l'heure de l'utilisateur (toISOString() donnerait la date en UTC).
export function dateDuJour(): string {
  const maintenant = new Date();
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
  const jour = String(maintenant.getDate()).padStart(2, '0');
  return `${maintenant.getFullYear()}-${mois}-${jour}`;
}

export const dateNonFuture: ValidatorFn = (
  controle: AbstractControl,
): ValidationErrors | null => {
  const valeur = String(controle.value ?? '');
  if (valeur === '') {
    return null;
  }
  return valeur <= dateDuJour() ? null : { dateFuture: true };
};
