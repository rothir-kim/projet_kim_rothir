import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationService } from '../services/confirmation-service';

/** Ce qu'une page doit savoir dire pour être protégée par le guard ci-dessous. */
export interface AvecModificationsNonEnregistrees {
  aDesModificationsNonEnregistrees(): boolean;
}

/** Demande confirmation avant de quitter une page dont les modifications ne sont pas enregistrées. */
export const modificationsNonEnregistreesGuard: CanDeactivateFn<AvecModificationsNonEnregistrees> = (
  page,
) => {
  if (!page.aDesModificationsNonEnregistrees()) {
    return true;
  }
  return inject(ConfirmationService).demander({
    titre: 'Quitter sans enregistrer ?',
    message: 'Vos modifications seront perdues si vous quittez cette page.',
    boutonAnnuler: 'Rester',
    boutonConfirmer: 'Quitter sans enregistrer',
  });
};
