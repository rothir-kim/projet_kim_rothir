import { hash } from "bcryptjs";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";
import { FORMAT_EMAIL, formaterTelephone, motDePasseRobuste, pasDansLeFutur } from "./validateurs";

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
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Le login est requis" },
        len: { args: [0, 50], msg: "Le login ne doit pas dépasser 50 caractères" },
      },
    },
    motDePasse: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { motDePasseRobuste },
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom est requis" },
        len: { args: [0, 100], msg: "Le nom ne doit pas dépasser 100 caractères" },
      },
    },
    prenom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le prénom est requis" },
        len: { args: [0, 100], msg: "Le prénom ne doit pas dépasser 100 caractères" },
      },
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "L'adresse est requise" },
        len: { args: [0, 255], msg: "L'adresse ne doit pas dépasser 255 caractères" },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        is: { args: FORMAT_EMAIL, msg: "L'email n'est pas valide" },
        len: { args: [0, 255], msg: "L'email ne doit pas dépasser 255 caractères" },
      },
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      // On enregistre toujours le numéro au format « 06 12 34 56 78 »
      set(valeur: unknown) {
        this.setDataValue("telephone", formaterTelephone(valeur) ?? String(valeur ?? ""));
      },
      validate: {
        is: { args: /^0[1-9]( \d{2}){4}$/, msg: "Le téléphone doit contenir 10 chiffres" },
      },
    },
    dateNaissance: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { isDate: { args: true, msg: "La date de naissance n'est pas valide" }, pasDansLeFutur },
    },
  },
  {
    sequelize,
    tableName: "utilisateur",
    timestamps: false,
    // Le mot de passe n'est jamais lu, sauf avec User.unscoped() (connexion)
    defaultScope: { attributes: { exclude: ["motDePasse"] } },
    hooks: {
      // Les validations passent avant : on vérifie le mot de passe en clair, puis on le hache
      beforeCreate: async (utilisateur) => {
        utilisateur.motDePasse = await hash(utilisateur.motDePasse, 10);
      },
    },
  }
);
