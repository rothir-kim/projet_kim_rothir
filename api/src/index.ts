import express, { Application, Request, Response } from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ORIGINES, PORT } from "./config";
import { sequelize } from "./models";
import { Pollution } from "./models/pollution.model";
import pollutionRoutes from "./routes/pollution.routes";

const app: Application = express();

app.use(cors({ origin: ORIGINES }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ statut: "ok" });
});

app.use("/api/pollutions", pollutionRoutes);

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(async () => {
    console.log("Connectée à la base de données");

    // Au premier lancement, on remplit la table avec pollutions.json
    if ((await Pollution.count()) === 0) {
      const fichier = readFileSync(path.join(__dirname, "..", "pollutions.json"), "utf-8");
      const donnees = JSON.parse(fichier).map(({ id, ...pollution }: { id: number }) => pollution);
      await Pollution.bulkCreate(donnees);
      console.log(`${donnees.length} pollutions ajoutées`);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API disponible sur le port ${PORT}`);
    });
  })
  .catch((erreur: Error) => {
    console.error("Connexion à la base impossible :", erreur.message);
  });