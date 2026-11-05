import { DataTypes, QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

// Les bases déjà créées avec sequelize.sync() ont déjà ces tables : on ne les recrée pas
export const up: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  const tables = (await requetes.showAllTables()).map(String);

  if (!tables.includes("utilisateur")) {
    await requetes.createTable("utilisateur", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      login: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      motDePasse: { type: DataTypes.STRING, allowNull: false },
      nom: { type: DataTypes.STRING(100), allowNull: false },
      prenom: { type: DataTypes.STRING(100), allowNull: false },
      adresse: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      telephone: { type: DataTypes.STRING(20), allowNull: false },
      dateNaissance: { type: DataTypes.DATEONLY, allowNull: false },
    });
  }

  if (!tables.includes("pollution")) {
    await requetes.createTable("pollution", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      titre: { type: DataTypes.STRING(120), allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      lieu: { type: DataTypes.STRING(200), allowNull: false },
      latitude: { type: DataTypes.FLOAT, allowNull: false },
      longitude: { type: DataTypes.FLOAT, allowNull: false },
      urlPhoto: { type: DataTypes.STRING(500), allowNull: true },
    });
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  await requetes.dropTable("pollution");
  await requetes.dropTable("utilisateur");
};
