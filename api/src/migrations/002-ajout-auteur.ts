import { DataTypes, QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

// Si le compte est supprimé, ses pollutions restent mais sans auteur (SET NULL)
export const up: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  const colonnes = await requetes.describeTable("pollution");
  if ("auteurId" in colonnes) {
    return;
  }
  await requetes.addColumn("pollution", "auteurId", {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "utilisateur", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
};

export const down: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  await requetes.removeColumn("pollution", "auteurId");
};
