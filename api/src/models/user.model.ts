import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

interface UserAttributs {
  id: number;
  login: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  telephone: string;
  dateNaissance: string;
}

type UserCreation = Optional<UserAttributs, "id">;

export class User extends Model<UserAttributs, UserCreation> implements UserAttributs {
  declare id: number;
  declare login: string;
  declare motDePasse: string;
  declare nom: string;
  declare prenom: string;
  declare adresse: string;
  declare email: string;
  declare telephone: string;
  declare dateNaissance: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    login: { type: DataTypes.STRING(50), allowNull: false, unique: true, validate: { notEmpty: true } },
    motDePasse: { type: DataTypes.STRING, allowNull: false },
    nom: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    prenom: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    adresse: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
    telephone: { type: DataTypes.STRING(20), allowNull: false, validate: { notEmpty: true } },
    dateNaissance: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: true } },
  },
  { sequelize, tableName: "utilisateur", timestamps: false }
);
