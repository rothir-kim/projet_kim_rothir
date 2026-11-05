import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";
import { User } from "./user.model";
import { pasDansLeFutur, urlHttp } from "./validateurs";

export const TYPES_POLLUTION = ["Plastique", "Chimique", "Dépôt sauvage", "Eau", "Air", "Autre"];

interface PollutionAttributs {
  id: number;
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  urlPhoto: string | null;
  auteurId: number | null;
}

// À la création, l'id, la photo et l'auteur ne sont pas obligatoires
export type PollutionCreation = Optional<PollutionAttributs, "id" | "urlPhoto" | "auteurId">;

export class Pollution
  extends Model<PollutionAttributs, PollutionCreation>
  implements PollutionAttributs
{
  declare id: number;
  declare titre: string;
  declare type: string;
  declare description: string;
  declare date: string;
  declare lieu: string;
  declare latitude: number;
  declare longitude: number;
  declare urlPhoto: string | null;
  declare auteurId: number | null;
  declare auteur?: User | null;
}

Pollution.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le titre est requis" },
        len: { args: [0, 120], msg: "Le titre ne doit pas dépasser 120 caractères" },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: { args: [TYPES_POLLUTION], msg: "Type de pollution inconnu" } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La description est requise" },
        len: { args: [0, 2000], msg: "La description ne doit pas dépasser 2000 caractères" },
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { isDate: { args: true, msg: "La date n'est pas valide" }, pasDansLeFutur },
    },
    lieu: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le lieu est requis" },
        len: { args: [0, 200], msg: "Le lieu ne doit pas dépasser 200 caractères" },
      },
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: "La latitude doit être un nombre" },
        min: { args: [-90], msg: "La latitude doit être entre -90 et 90" },
        max: { args: [90], msg: "La latitude doit être entre -90 et 90" },
      },
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: "La longitude doit être un nombre" },
        min: { args: [-180], msg: "La longitude doit être entre -180 et 180" },
        max: { args: [180], msg: "La longitude doit être entre -180 et 180" },
      },
    },
    urlPhoto: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: { urlHttp, len: { args: [0, 500], msg: "L'URL de la photo ne doit pas dépasser 500 caractères" } },
    },
    auteurId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "pollution", timestamps: false }
);

Pollution.belongsTo(User, { as: "auteur", foreignKey: "auteurId" });

// Ce qu'on renvoie de l'auteur avec chaque pollution
export const AVEC_AUTEUR = {
  include: [{ model: User, as: "auteur", attributes: ["id", "prenom", "nom"] }],
};
