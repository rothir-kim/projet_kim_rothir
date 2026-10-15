import { Component } from '@angular/core';
import { RegisterComponent } from './components/register/register';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}