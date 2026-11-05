const lireDatabaseUrl = (): string => {
  const valeur = process.env.DATABASE_URL;
  if (!valeur) {
    throw new Error("DATABASE_URL manquante : ajoute-la dans api/.env (voir le README)");
  }
  return valeur;
};

export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = lireDatabaseUrl();
export const ORIGINES = (process.env.ORIGINES_AUTORISEES ?? "http://localhost:4200")
  .split(",")
  .map((origine) => origine.trim());
