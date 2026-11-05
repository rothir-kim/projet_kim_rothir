import { Request, Response } from "express";
import { compare } from "bcryptjs";
import { User } from "../models/user.model";

// Les vérifications (mot de passe, téléphone…) et le hachage sont faits dans le modèle
export const getAll = async (_req: Request, res: Response) => {
  const utilisateurs = await User.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] });
  res.json(utilisateurs);
};

export const create = async (req: Request, res: Response) => {
  const { login, motDePasse, nom, prenom, adresse, email, telephone, dateNaissance } = req.body ?? {};
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
