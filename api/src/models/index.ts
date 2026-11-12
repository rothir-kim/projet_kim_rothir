import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config";

// En local pas de SSL, sur Render il est obligatoire
const { hostname } = new URL(DATABASE_URL);
const estEnLocal = hostname === "localhost" || hostname === "127.0.0.1";

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: estEnLocal ? {} : { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});
