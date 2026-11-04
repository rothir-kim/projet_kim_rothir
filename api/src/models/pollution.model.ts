import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

const TYPES_POLLUTION = ["Plastique", "Chimique", "Dépôt sauvage", "Eau", "Air", "Autre"];

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
}

// À la création, l'id et la photo ne sont pas obligatoires
export type PollutionCreation = Optional<PollutionAttributs, "id" | "urlPhoto">;

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
}

Pollution.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titre: { type: DataTypes.STRING(120), allowNull: false, validate: { notEmpty: true } },
    type: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [TYPES_POLLUTION] } },
    description: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    date: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: true } },
    lieu: { type: DataTypes.STRING(200), allowNull: false, validate: { notEmpty: true } },
    latitude: { type: DataTypes.FLOAT, allowNull: false, validate: { min: -90, max: 90 } },
    longitude: { type: DataTypes.FLOAT, allowNull: false, validate: { min: -180, max: 180 } },
    urlPhoto: { type: DataTypes.STRING(500), allowNull: true },
  },
  { sequelize, tableName: "pollution", timestamps: false }
);
