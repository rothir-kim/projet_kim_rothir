import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config";

// En local pas de SSL, sur Render il est obligatoire
const estEnLocal = DATABASE_URL.includes("localhost");

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: estEnLocal ? {} : { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});