import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pollution } from '../../modeles/pollution.modele';

@Component({
  selector: 'app-carte-pollution',
  imports: [DatePipe, RouterLink],
  templateUrl: './carte-pollution.html',
  styleUrl: './carte-pollution.scss',
})
export class CartePollution {
  pollution = input.required<Pollution>();
  suppressionConfirmee = output<number>();
  confirmationEnCours = signal(false);

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
