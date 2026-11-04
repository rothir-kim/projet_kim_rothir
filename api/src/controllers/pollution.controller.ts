import { Request, Response } from "express";
import { ValidationError } from "sequelize";
import { Pollution, PollutionCreation } from "../models/pollution.model";

// On garde seulement les champs attendus (jamais l'id envoyé par le client)
const lireSaisie = (req: Request): PollutionCreation => {
  const { titre, type, description, date, lieu, latitude, longitude, urlPhoto } = req.body ?? {};
  return { titre, type, description, date, lieu, latitude, longitude, urlPhoto: urlPhoto || null };
};

const repondreErreur = (res: Response, erreur: unknown) => {
  if (erreur instanceof ValidationError) {
    const details = erreur.errors.map((e) => e.message);
    res.status(400).json({ message: "Données invalides", details });
    return;
  }
  res.status(500).json({ message: "Erreur serveur" });
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const pollutions = await Pollution.findAll({
      order: [["date", "DESC"], ["id", "DESC"]],
    });
    res.json(pollutions);
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const pollution = await Pollution.findByPk(Number(req.params.id));
    if (!pollution) {
      res.status(404).json({ message: "Pollution introuvable" });
      return;
    }
    res.json(pollution);
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const pollution = await Pollution.create(lireSaisie(req));
    res.status(201).json(pollution);
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const pollution = await Pollution.findByPk(Number(req.params.id));
    if (!pollution) {
      res.status(404).json({ message: "Pollution introuvable" });
      return;
    }
    await pollution.update(lireSaisie(req));
    res.json(pollution);
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const nombreSupprimees = await Pollution.destroy({ where: { id: Number(req.params.id) } });
    if (nombreSupprimees === 0) {
      res.status(404).json({ message: "Pollution introuvable" });
      return;
    }
    res.status(204).end();
  } catch (erreur) {
    repondreErreur(res, erreur);
  }
};
