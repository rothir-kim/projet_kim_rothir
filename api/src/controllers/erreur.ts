import { Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";

export const repondreErreur = (res: Response, erreur: unknown) => {
  if (erreur instanceof UniqueConstraintError) {
    res.status(409).json({ message: "Cette valeur est déjà utilisée" });
    return;
  }
  if (erreur instanceof ValidationError) {
    const details = erreur.errors.map((e) => e.message);
    res.status(400).json({ message: "Données invalides", details });
    return;
  }
  res.status(500).json({ message: "Erreur serveur" });
};
