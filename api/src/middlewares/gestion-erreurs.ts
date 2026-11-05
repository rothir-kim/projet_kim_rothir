import { NextFunction, Request, Response } from "express";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";

// Express 5 envoie ici toutes les erreurs des contrôleurs : plus besoin de try/catch partout
export const gestionErreurs = (erreur: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (erreur instanceof UniqueConstraintError) {
    res.status(409).json({ message: "Ce login ou cet email est déjà utilisé" });
    return;
  }
  if (erreur instanceof ValidationError) {
    const details = erreur.errors.map((e) => e.message);
    res.status(400).json({ message: "Données invalides", details });
    return;
  }
  if (erreur instanceof ForeignKeyConstraintError) {
    res.status(400).json({ message: "Données invalides", details: ["Cet auteur n'existe pas"] });
    return;
  }
  if (erreur instanceof SyntaxError) {
    res.status(400).json({ message: "Le corps de la requête n'est pas du JSON valide" });
    return;
  }
  console.error(erreur);
  res.status(500).json({ message: "Erreur serveur" });
};
