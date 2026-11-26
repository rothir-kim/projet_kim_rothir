import { Response } from "express";
import { PollutionCreation, TYPES_POLLUTION } from "./pollution.model";
import {
  estDatePassee,
  estEmailValide,
  estMotDePasseRobuste,
  estNombreEntre,
  estTexteValide,
  estUrlHttp,
  formaterTelephone,
  MESSAGE_MOT_DE_PASSE,
} from "./validateurs";

// Un contrôle par champ : on renvoie toutes les erreurs d'un coup (liste vide si tout est bon)

export const erreursPollution = (saisie: PollutionCreation): string[] => {
  const erreurs: string[] = [];
  if (!estTexteValide(saisie.titre, 120)) {
    erreurs.push("Le titre est requis (120 caractères maximum)");
  }
  if (!TYPES_POLLUTION.includes(saisie.type)) {
    erreurs.push("Type de pollution inconnu");
  }
  if (!estTexteValide(saisie.description, 2000)) {
    erreurs.push("La description est requise (2000 caractères maximum)");
  }
  if (!estDatePassee(saisie.date)) {
    erreurs.push("La date doit être une date valide, pas dans le futur");
  }
  if (!estTexteValide(saisie.lieu, 200)) {
    erreurs.push("Le lieu est requis (200 caractères maximum)");
  }
  if (!estNombreEntre(saisie.latitude, -90, 90)) {
    erreurs.push("La latitude doit être un nombre entre -90 et 90");
  }
  if (!estNombreEntre(saisie.longitude, -180, 180)) {
    erreurs.push("La longitude doit être un nombre entre -180 et 180");
  }
  if (!Number.isInteger(saisie.indiceDangerosite) || !estNombreEntre(saisie.indiceDangerosite, 0, 150)) {
    erreurs.push("L'indice de dangerosité doit être un nombre entier entre 0 et 150");
  }
  if (saisie.urlPhoto && (!estUrlHttp(saisie.urlPhoto) || saisie.urlPhoto.length > 500)) {
    erreurs.push("La photo doit être une URL commençant par http:// ou https:// (500 caractères maximum)");
  }
  return erreurs;
};

export interface SaisieUtilisateur {
  login?: unknown;
  motDePasse?: unknown;
  nom?: unknown;
  prenom?: unknown;
  adresse?: unknown;
  email?: unknown;
  telephone?: unknown;
  dateNaissance?: unknown;
}

export const erreursUtilisateur = (saisie: SaisieUtilisateur): string[] => {
  const erreurs: string[] = [];
  if (!estTexteValide(saisie.login, 50)) {
    erreurs.push("Le login est requis (50 caractères maximum)");
  }
  if (!estMotDePasseRobuste(saisie.motDePasse)) {
    erreurs.push(MESSAGE_MOT_DE_PASSE);
  }
  if (!estTexteValide(saisie.nom, 100)) {
    erreurs.push("Le nom est requis (100 caractères maximum)");
  }
  if (!estTexteValide(saisie.prenom, 100)) {
    erreurs.push("Le prénom est requis (100 caractères maximum)");
  }
  if (!estTexteValide(saisie.adresse, 255)) {
    erreurs.push("L'adresse est requise (255 caractères maximum)");
  }
  if (!estEmailValide(saisie.email)) {
    erreurs.push("L'email n'est pas valide");
  }
  if (formaterTelephone(saisie.telephone) === null) {
    erreurs.push("Le téléphone doit contenir 10 chiffres");
  }
  if (!estDatePassee(saisie.dateNaissance)) {
    erreurs.push("La date de naissance doit être une date valide, pas dans le futur");
  }
  return erreurs;
};

// Répond 400 s'il y a des erreurs (et renvoie true pour que le contrôleur s'arrête)
export const refuserSiErreurs = (res: Response, erreurs: string[]): boolean => {
  if (erreurs.length === 0) {
    return false;
  }
  res.status(400).json({ message: "Données invalides", details: erreurs });
  return true;
};
