import { Component } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up'; // Import du nouveau composant

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SignUpComponent], // Ajout dans le tableau imports
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'kim_rothir';
}