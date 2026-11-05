import express, { Application, Request, Response } from "express";
import cors from "cors";
import { ORIGINES, PORT } from "./config";
import { gestionErreurs } from "./middlewares/gestion-erreurs";
import { migrations } from "./migrations";
import { sequelize } from "./models";
import pollutionRoutes from "./routes/pollution.routes";
import userRoutes from "./routes/user.routes";

const app: Application = express();

app.use(cors({ origin: ORIGINES }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ statut: "ok" });
});

app.use("/api/pollutions", pollutionRoutes);
app.use("/api/users", userRoutes);

// Toujours en dernier : reçoit les erreurs de toutes les routes au-dessus
app.use(gestionErreurs);

const demarrer = async () => {
  await sequelize.authenticate();
  console.log("Connectée à la base de données");
  // Crée ou met à jour les tables, et ajoute les pollutions de départ si la base est vide
  await migrations.up();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API disponible sur le port ${PORT}`);
  });
};

demarrer().catch((erreur: Error) => {
  console.error("Démarrage impossible :", erreur.message);
  process.exit(1);
});
