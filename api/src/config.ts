export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const ORIGINES = (process.env.ORIGINES_AUTORISEES ?? "http://localhost:4200")
  .split(",")
  .map((origine) => origine.trim());