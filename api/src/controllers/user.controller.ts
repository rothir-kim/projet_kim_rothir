import { Request, Response } from "express";
import { compare } from "bcryptjs";
import { User } from "../models/user.model";
import {
  estDatePassee,
  estEmailValide,
  estMotDePasseRobuste,
  estTexteValide,
  formaterTelephone,
  MESSAGE_MOT_DE_PASSE,
} from "../models/validateurs";

export const getAll = async (_req: Request, res: Response) => {
  const utilisateurs = await User.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] });
  res.json(utilisateurs);
};

export const create = async (req: Request, res: Response) => {
  const { login, motDePasse, nom, prenom, adresse, email, telephone, dateNaissance } = req.body ?? {};

  // Un contrôle par champ reçu : on liste toutes les erreurs avant de répondre
  const erreurs: string[] = [];
  if (!estTexteValide(login, 50)) {
    erreurs.push("Le login est requis (50 caractères maximum)");
  }
  if (!estMotDePasseRobuste(motDePasse)) {
    erreurs.push(MESSAGE_MOT_DE_PASSE);
  }
  if (!estTexteValide(nom, 100)) {
    erreurs.push("Le nom est requis (100 caractères maximum)");
  }
  if (!estTexteValide(prenom, 100)) {
    erreurs.push("Le prénom est requis (100 caractères maximum)");
  }
  if (!estTexteValide(adresse, 255)) {
    erreurs.push("L'adresse est requise (255 caractères maximum)");
  }
  if (!estEmailValide(email)) {
    erreurs.push("L'email n'est pas valide");
  }
  if (formaterTelephone(telephone) === null) {
    erreurs.push("Le téléphone doit contenir 10 chiffres");
  }
  if (!estDatePassee(dateNaissance)) {
    erreurs.push("La date de naissance doit être une date valide, pas dans le futur");
  }
  if (erreurs.length > 0) {
    res.status(400).json({ message: "Données invalides", details: erreurs });
    return;
  }

  const utilisateur = await User.create({
    login,
    motDePasse,
    nom,
    prenom,
    adresse,
    email,
    telephone,
    dateNaissance,
  });
  // On relit l'utilisateur pour le renvoyer sans le mot de passe
  res.status(201).json(await User.findByPk(utilisateur.id));
};

export const remove = async (req: Request, res: Response) => {
  const nombreSupprimes = await User.destroy({ where: { id: Number(req.params.id) } });
  if (nombreSupprimes === 0) {
    res.status(404).json({ message: "Utilisateur introuvable" });
    return;
  }
  res.status(204).end();
};

export const login = async (req: Request, res: Response) => {
  const identifiant = req.body?.login;
  const motDePasse = req.body?.motDePasse;
  if (typeof identifiant !== "string" || typeof motDePasse !== "string") {
    res.status(400).json({ message: "Login et mot de passe obligatoires" });
    return;
  }
  const utilisateur = await User.unscoped().findOne({ where: { login: identifiant } });
  if (!utilisateur || !(await compare(motDePasse, utilisateur.motDePasse))) {
    res.status(401).json({ message: "Login ou mot de passe incorrect" });
    return;
  }
  res.json(await User.findByPk(utilisateur.id));
};
