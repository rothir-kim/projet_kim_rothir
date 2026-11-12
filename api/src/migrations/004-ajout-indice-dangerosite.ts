import { DataTypes, QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

// Indice donné à chaque pollution de départ, retrouvée par son titre
const INDICES_DE_DEPART: Record<string, number> = {
  "Déchets plastiques sur la plage": 35,
  "Rejet suspect dans le canal": 75,
  "Dépôt sauvage en lisière de forêt": 45,
  "Eau trouble après des travaux": 15,
  "Fumées noires en zone urbaine": 90,
  "Mégots et canettes au bord du lac": 10,
  "Bidons de produits non identifiés": 130,
  "Pollution lumineuse d'un parking": 5,
};

export const up: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  const colonnes = await requetes.describeTable("pollution");
  if ("indiceDangerosite" in colonnes) {
    return;
  }
  // Les pollutions déjà enregistrées reçoivent 0 au départ
  await requetes.addColumn("pollution", "indiceDangerosite", {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });
  for (const [titre, indice] of Object.entries(INDICES_DE_DEPART)) {
    await requetes.bulkUpdate("pollution", { indiceDangerosite: indice }, { titre });
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  await requetes.removeColumn("pollution", "indiceDangerosite");
};
