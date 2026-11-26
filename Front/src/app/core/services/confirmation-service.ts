import { Injectable, signal } from '@angular/core';

/** Le texte affiché dans la fenêtre de confirmation. */
export interface DemandeConfirmation {
  titre: string;
  message: string;
  boutonAnnuler: string;
  boutonConfirmer: string;
}

/** Ouvre la fenêtre de confirmation et donne la réponse (vrai = confirmé). */
@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private demandeEnCours = signal<DemandeConfirmation | null>(null);
  private envoyerReponse: ((reponse: boolean) => void) | null = null;

  readonly demande = this.demandeEnCours.asReadonly();

  // La Promise attend que l'utilisateur clique sur un des deux boutons
  demander(demande: DemandeConfirmation): Promise<boolean> {
    this.envoyerReponse?.(false);
    this.demandeEnCours.set(demande);
    return new Promise((resoudre) => (this.envoyerReponse = resoudre));
  }

  repondre(reponse: boolean): void {
    this.envoyerReponse?.(reponse);
    this.envoyerReponse = null;
    this.demandeEnCours.set(null);
  }
}
