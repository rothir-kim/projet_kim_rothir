import { Component, signal, computed } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignUpData, PasswordCriteria } from './sign-up.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUpComponent {
  readonly formData = signal<SignUpData>({
    login: '',
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmationMotDePasse: ''
  });

  readonly isSubmitted = signal<boolean>(false);

  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);

  readonly passwordCriteria = computed<PasswordCriteria>(() => {
    const pwd = this.formData().motDePasse;
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };
  });

  readonly isPasswordValid = computed<boolean>(() => {
    const c = this.passwordCriteria();
    return c.minLength && c.hasUppercase && c.hasLowercase && c.hasNumber && c.hasSpecialChar;
  });

  readonly isPasswordMatching = computed<boolean>(() => {
    const data = this.formData();
    return data.motDePasse !== '' && data.motDePasse === data.confirmationMotDePasse;
  });

  readonly isFormValid = computed<boolean>(() => {
    const data = this.formData();
    const hasRequiredFields = 
      !!data.login.trim() && 
      !!data.nom.trim() && 
      !!data.prenom.trim() && 
      !!data.email.trim();

    return hasRequiredFields && this.isPasswordValid() && this.isPasswordMatching();
  });

  onFieldChange(field: keyof SignUpData, value: string): void {
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.isFormValid()) {
      this.isSubmitted.set(true);
    }
  }

  resetForm(): void {
    this.formData.set({
      login: '',
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      confirmationMotDePasse: ''
    });
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);
    this.isSubmitted.set(false);
  }
}