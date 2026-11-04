import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { User } from "../models/user.model";
import { repondreErreur } from "./erreur";

const MESSAGE_MOT_DE_PASSE =
  "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";

const motDePasseValide = (motDePasse: unknown): motDePasse is string =>
  typeof motDePasse === "string" &&
  motDePasse.length >= 8 &&
  /[a-z]/.test(motDePasse) &&
  /[A-Z]/.test(motDePasse) &&
  /[0-9]/.test(motDePasse) &&
  /[^a-zA-Z0-9]/.test(motDePasse);

// Le mot de passe ne doit jamais repartir vers le navigateur
const sansMotDePasse = (utilisateur: User) => {
  const { motDePasse, ...reste } = utilisateur.get();
  return reste;
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const utilisateurs = await User.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] });
    res.json(utilisateurs.map(sansMotDePasse));
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { login, motDePasse, nom, prenom, adresse, email, telephone, dateNaissance } = req.body ?? {};
    if (!motDePasseValide(motDePasse)) {
      res.status(400).json({ message: "Données invalides", details: [MESSAGE_MOT_DE_PASSE] });
      return;
    }
    const utilisateur = await User.create({
      login,
      motDePasse: await hash(motDePasse, 10),
      nom,
      prenom,
      adresse,
      email,
      telephone,
      dateNaissance,
    });
    res.status(201).json(sansMotDePasse(utilisateur));
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const nombreSupprimes = await User.destroy({ where: { id: Number(req.params.id) } });
    if (nombreSupprimes === 0) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    res.status(204).end();
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const identifiant = req.body?.login;
    const motDePasse = req.body?.motDePasse;
    if (typeof identifiant !== "string" || typeof motDePasse !== "string") {
      res.status(400).json({ message: "Login et mot de passe obligatoires" });
      return;
    }
    const utilisateur = await User.findOne({ where: { login: identifiant } });
    if (!utilisateur || !(await compare(motDePasse, utilisateur.motDePasse))) {
      res.status(401).json({ message: "Login ou mot de passe incorrect" });
      return;
    }
    res.json(sansMotDePasse(utilisateur));
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};
