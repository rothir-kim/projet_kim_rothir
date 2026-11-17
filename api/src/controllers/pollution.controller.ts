import { Request, Response } from "express";
import { AVEC_AUTEUR, Pollution, PollutionCreation, TYPES_POLLUTION } from "../models/pollution.model";
import { estDatePassee, estNombreEntre, estTexteValide, estUrlHttp } from "../models/validateurs";

// On garde seulement les champs attendus (jamais l'id ni l'auteur envoyés par le client)
const lireSaisie = (req: Request): PollutionCreation => {
  const { titre, type, description, date, lieu, latitude, longitude, urlPhoto, indiceDangerosite } =
    req.body ?? {};
  const saisie: PollutionCreation = {
    titre,
    type,
    description,
    date,
    lieu,
    latitude,
    longitude,
    indiceDangerosite,
  };
  // Photo absente : on n'y touche pas. Vide ou null : on l'enlève
  if (urlPhoto !== undefined) {
    saisie.urlPhoto = urlPhoto || null;
  }
  return saisie;
};

// Un contrôle par champ reçu : renvoie la liste des erreurs (vide si tout est bon)
const controlerSaisie = (saisie: PollutionCreation): string[] => {
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

export const getAll = async (_req: Request, res: Response) => {
  const pollutions = await Pollution.findAll({
    ...AVEC_AUTEUR,
    order: [["date", "DESC"], ["id", "DESC"]],
  });
  res.json(pollutions);
};

export const getById = async (req: Request, res: Response) => {
  const pollution = await Pollution.findByPk(Number(req.params.id), AVEC_AUTEUR);
  if (!pollution) {
    res.status(404).json({ message: "Pollution introuvable" });
    return;
  }
  res.json(pollution);
};

export const create = async (req: Request, res: Response) => {
  const auteurId = Number(req.body?.auteurId);
  if (!Number.isInteger(auteurId) || auteurId <= 0) {
    res.status(400).json({ message: "Données invalides", details: ["L'auteur est obligatoire"] });
    return;
  }
  const saisie = lireSaisie(req);
  const erreurs = controlerSaisie(saisie);
  if (erreurs.length > 0) {
    res.status(400).json({ message: "Données invalides", details: erreurs });
    return;
  }
  const pollution = await Pollution.create({ ...saisie, auteurId });
  res.status(201).json(await Pollution.findByPk(pollution.id, AVEC_AUTEUR));
};

export const update = async (req: Request, res: Response) => {
  const pollution = await Pollution.findByPk(Number(req.params.id));
  if (!pollution) {
    res.status(404).json({ message: "Pollution introuvable" });
    return;
  }
  const saisie = lireSaisie(req);
  const erreurs = controlerSaisie(saisie);
  if (erreurs.length > 0) {
    res.status(400).json({ message: "Données invalides", details: erreurs });
    return;
  }
  await pollution.update(saisie);
  res.json(await Pollution.findByPk(pollution.id, AVEC_AUTEUR));
};

export const remove = async (req: Request, res: Response) => {
  const nombreSupprimees = await Pollution.destroy({ where: { id: Number(req.params.id) } });
  if (nombreSupprimees === 0) {
    res.status(404).json({ message: "Pollution introuvable" });
    return;
  }
  res.status(204).end();
};