import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Mêmes règles que l'API
export const CRITERES_MOT_DE_PASSE = [
  { libelle: 'Au moins 8 caractères', test: (valeur: string) => valeur.length >= 8 },
  { libelle: 'Une majuscule', test: (valeur: string) => /[A-Z]/.test(valeur) },
  { libelle: 'Une minuscule', test: (valeur: string) => /[a-z]/.test(valeur) },
  { libelle: 'Un chiffre', test: (valeur: string) => /[0-9]/.test(valeur) },
  { libelle: 'Un caractère spécial', test: (valeur: string) => /[^a-zA-Z0-9]/.test(valeur) },
];

export const motDePasseRobuste: ValidatorFn = (
  controle: AbstractControl,
): ValidationErrors | null => {
  const valeur = String(controle.value ?? '');
  return CRITERES_MOT_DE_PASSE.every((critere) => critere.test(valeur))
    ? null
    : { motDePasseFaible: true };
};

// Se place sur le formulaire entier, car il compare deux champs
export const motsDePasseIdentiques: ValidatorFn = (
  formulaire: AbstractControl,
): ValidationErrors | null => {
  const motDePasse = formulaire.get('motDePasse')?.value;
  const confirmation = formulaire.get('confirmation')?.value;
  return motDePasse === confirmation ? null : { confirmationDifferente: true };
};
