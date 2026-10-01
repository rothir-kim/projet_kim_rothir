import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUpComponent {
  // Modèle pour stocker les données du formulaire
  user = {
    login: '',
    password: '',
    confirmPassword: '',
    lastName: '',
    firstName: '',
    email: ''
  };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Formulaire soumis avec succès :', this.user);
    }
  }
}