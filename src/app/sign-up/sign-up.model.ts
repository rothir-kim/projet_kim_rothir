export interface SignUpData {
  login: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
}

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}