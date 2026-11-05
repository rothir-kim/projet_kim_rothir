import { AbstractControl } from '@angular/forms';

// Vrai si le champ a une erreur et que l'utilisateur l'a déjà touché
export function champInvalide(controle: AbstractControl): boolean {
  return controle.invalid && controle.touched;
}
