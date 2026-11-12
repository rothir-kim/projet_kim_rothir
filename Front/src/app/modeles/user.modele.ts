export interface User {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  telephone: string;
  dateNaissance: string;
}

export interface UserSaisie extends Omit<User, 'id'> {
  motDePasse: string;
}
