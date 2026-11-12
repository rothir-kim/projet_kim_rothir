import { Request, Response } from "express";
import { AVEC_AUTEUR, Pollution, PollutionCreation } from "../models/pollution.model";

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
  const pollution = await Pollution.create({ ...lireSaisie(req), auteurId });
  res.status(201).json(await Pollution.findByPk(pollution.id, AVEC_AUTEUR));
};

export const update = async (req: Request, res: Response) => {
  const pollution = await Pollution.findByPk(Number(req.params.id));
  if (!pollution) {
    res.status(404).json({ message: "Pollution introuvable" });
    return;
  }
  await pollution.update(lireSaisie(req));
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