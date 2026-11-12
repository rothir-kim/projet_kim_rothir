import { NextFunction, Request, Response } from "express";

// Refuse les id qui ne sont pas des nombres entiers positifs (ex : /api/pollutions/abc)
export const verifierId = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(404).json({ message: "Élément introuvable" });
    return;
  }
  next();
};
