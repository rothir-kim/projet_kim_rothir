import { SequelizeStorage, Umzug } from "umzug";
import { sequelize } from "../models";
import * as creationTables from "./001-creation-tables";
import * as ajoutAuteur from "./002-ajout-auteur";

// Une nouvelle migration = un nouveau fichier ajouté à la fin de cette liste
export const migrations = new Umzug({
  migrations: [
    { name: "001-creation-tables", ...creationTables },
    { name: "002-ajout-auteur", ...ajoutAuteur },
  ],
  context: sequelize.getQueryInterface(),
  // La liste des migrations déjà faites est gardée dans la table SequelizeMeta
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});
