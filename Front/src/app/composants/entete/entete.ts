import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-entete',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './entete.html',
  styleUrl: './entete.scss',
})
export class Entete {}
