import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HighlightPollutionDirective } from '../../directives/highlight-pollution.directive';
import { Pollution } from '../../modeles/pollution.modele';
import { PollutionLevelPipe } from '../../pipes/pollution-level.pipe';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-carte-pollution',
  imports: [DatePipe, RouterLink, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './carte-pollution.html',
  styleUrl: './carte-pollution.scss',
})
export class CartePollution {
  pollution = input.required<Pollution>();
  suppressionConfirmee = output<number>();
  confirmationEnCours = signal(false);
  utilisateurConnecte = inject(UserService).utilisateurConnecte;

  demanderConfirmation(): void {
    this.confirmationEnCours.set(true);
  }

  annuler(): void {
    this.confirmationEnCours.set(false);
  }

  confirmer(): void {
    this.confirmationEnCours.set(false);
    this.suppressionConfirmee.emit(this.pollution().id);
  }
}
