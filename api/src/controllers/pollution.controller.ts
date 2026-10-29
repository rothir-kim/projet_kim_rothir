import { Request, Response } from "express";
import { Pollution } from "../models/pollution.model";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const pollutions = await Pollution.findAll({
      order: [["date", "DESC"], ["id", "DESC"]],
    });
    res.json(pollutions);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
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
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};