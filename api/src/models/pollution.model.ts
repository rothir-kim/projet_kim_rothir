import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

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
type PollutionCreation = Optional<PollutionAttributs, "id" | "urlPhoto">;

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
    titre: { type: DataTypes.STRING(120), allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    lieu: { type: DataTypes.STRING(200), allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    urlPhoto: { type: DataTypes.STRING(500), allowNull: true },
  },
  { sequelize, tableName: "pollution", timestamps: false }
);