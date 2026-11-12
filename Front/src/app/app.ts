import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Entete } from './core/entete/entete';
import { FenetreConfirmation } from './shared/fenetre-confirmation/fenetre-confirmation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Entete, FenetreConfirmation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
