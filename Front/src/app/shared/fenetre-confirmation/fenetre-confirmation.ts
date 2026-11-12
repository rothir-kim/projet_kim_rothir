import { Component, ElementRef, afterRenderEffect, inject, viewChild } from '@angular/core';
import { ConfirmationService } from '../../core/services/confirmation-service';

/** La fenêtre de confirmation, posée une seule fois dans app.html. */
@Component({
  selector: 'app-fenetre-confirmation',
  templateUrl: './fenetre-confirmation.html',
  styleUrl: './fenetre-confirmation.scss',
})
export class FenetreConfirmation {
  private serviceConfirmation = inject(ConfirmationService);
  private fenetre = viewChild.required<ElementRef<HTMLDialogElement>>('fenetre');

  demande = this.serviceConfirmation.demande;

  constructor() {
    // Après chaque affichage : ouvre ou ferme la balise <dialog> selon la demande en cours
    afterRenderEffect(() => {
      const dialogue = this.fenetre().nativeElement;
      if (this.demande() && !dialogue.open) {
        dialogue.showModal();
      } else if (!this.demande() && dialogue.open) {
        dialogue.close();
      }
    });
  }

  repondre(reponse: boolean): void {
    this.serviceConfirmation.repondre(reponse);
  }
}
