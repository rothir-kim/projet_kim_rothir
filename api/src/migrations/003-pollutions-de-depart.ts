import { readFileSync } from "node:fs";
import path from "node:path";
import { QueryInterface, QueryTypes } from "sequelize";
import type { MigrationFn } from "umzug";

interface PollutionDeDepart {
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  urlPhoto?: string | null;
}

// Une migration ne s'exécute qu'une fois : les pollutions de départ ne reviennent plus toutes seules
export const up: MigrationFn<QueryInterface> = async ({ context: requetes }) => {
  const [{ nombre }] = await requetes.sequelize.query<{ nombre: number }>(
    "SELECT COUNT(*)::int AS nombre FROM pollution",
    { type: QueryTypes.SELECT }
  );
  // Les bases déjà remplies (locale et Render) ne reçoivent rien
  if (nombre > 0) {
    return;
  }

  const fichier = readFileSync(path.join(__dirname, "..", "..", "pollutions.json"), "utf-8");
  const pollutions: PollutionDeDepart[] = JSON.parse(fichier);
  await requetes.bulkInsert(
    "pollution",
    pollutions.map((pollution) => ({
      titre: pollution.titre,
      type: pollution.type,
      description: pollution.description,
      date: pollution.date,
      lieu: pollution.lieu,
      latitude: pollution.latitude,
      longitude: pollution.longitude,
      urlPhoto: pollution.urlPhoto ?? null,
      auteurId: null,
    }))
  );
};

// On ne supprime rien en arrière : ces pollutions ont pu être modifiées depuis
export const down: MigrationFn<QueryInterface> = async () => {};
