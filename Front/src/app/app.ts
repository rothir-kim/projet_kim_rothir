import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Entete } from './composants/entete/entete';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Entete],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
