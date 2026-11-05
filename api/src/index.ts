import express, { Application, Request, Response } from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ORIGINES, PORT } from "./config";
import { gestionErreurs } from "./middlewares/gestion-erreurs";
import { migrations } from "./migrations";
import { sequelize } from "./models";
import { Pollution, PollutionCreation } from "./models/pollution.model";
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

// Au premier lancement, on remplit la table avec pollutions.json (sans auteur)
const remplirPollutions = async () => {
  if ((await Pollution.count()) > 0) {
    return;
  }
  const fichier = readFileSync(path.join(__dirname, "..", "pollutions.json"), "utf-8");
  const donnees: PollutionCreation[] = JSON.parse(fichier).map(
    ({ id, ...pollution }: PollutionCreation) => pollution
  );
  await Pollution.bulkCreate(donnees);
  console.log(`${donnees.length} pollutions ajoutées`);
};

const demarrer = async () => {
  await sequelize.authenticate();
  console.log("Connectée à la base de données");
  await migrations.up();
  await remplirPollutions();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API disponible sur le port ${PORT}`);
  });
};

demarrer().catch((erreur: Error) => {
  console.error("Démarrage impossible :", erreur.message);
  process.exit(1);
});
