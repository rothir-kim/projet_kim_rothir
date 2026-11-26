// Même règle que le front (Front/src/app/shared/validateurs/email.validateur.ts)
export const FORMAT_EMAIL = /^[^\s@]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

export const estTexteValide = (valeur: unknown, longueurMax: number): boolean =>
  typeof valeur === "string" && valeur.trim() !== "" && valeur.length <= longueurMax;

export const estNombreEntre = (valeur: unknown, min: number, max: number): boolean =>
  typeof valeur === "number" && Number.isFinite(valeur) && valeur >= min && valeur <= max;

export const estEmailValide = (valeur: unknown): boolean =>
  typeof valeur === "string" && valeur.length <= 255 && FORMAT_EMAIL.test(valeur);

// Un jour de marge : le serveur Render est en heure UTC, pas à l'heure française
const estDansLeFutur = (date: Date): boolean => date > new Date(Date.now() + 24 * 60 * 60 * 1000);

// Format AAAA-MM-JJ exigé : on relit la date avec toISOString() pour refuser "1", "salut" ou "2024-02-30"
export const estDatePassee = (valeur: unknown): boolean => {
  if (typeof valeur !== "string") {
    return false;
  }
  const date = new Date(valeur);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === valeur && !estDansLeFutur(date);
};

export const estUrlHttp = (valeur: unknown): boolean => {
  try {
    const { protocol } = new URL(String(valeur));
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

export const estMotDePasseRobuste = (valeur: unknown): boolean => {
  const texte = String(valeur ?? "");
  return (
    texte.length >= 8 &&
    /[a-z]/.test(texte) &&
    /[A-Z]/.test(texte) &&
    /[0-9]/.test(texte) &&
    /[^a-zA-Z0-9]/.test(texte)
  );
};

export const MESSAGE_MOT_DE_PASSE =
  "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";

// Les trois fonctions ci-dessous servent au modèle Sequelize : elles lèvent une erreur au lieu de renvoyer faux
export const pasDansLeFutur = (valeur: unknown): void => {
  if (estDansLeFutur(new Date(String(valeur)))) {
    throw new Error("La date ne peut pas être dans le futur");
  }
};

export const urlHttp = (valeur: unknown): void => {
  if (valeur !== null && valeur !== undefined && !estUrlHttp(valeur)) {
    throw new Error("La photo doit être une URL commençant par http:// ou https://");
  }
};

export const motDePasseRobuste = (valeur: unknown): void => {
  if (!estMotDePasseRobuste(valeur)) {
    throw new Error(MESSAGE_MOT_DE_PASSE);
  }
};

// Renvoie le numéro au format « 06 12 34 56 78 », ou null s'il n'est pas valide
export const formaterTelephone = (valeur: unknown): string | null => {
  const chiffres = String(valeur ?? "").replace(/\s/g, "");
  if (!/^0?[1-9][0-9]{8}$/.test(chiffres)) {
    return null;
  }
  const avecZero = chiffres.length === 9 ? `0${chiffres}` : chiffres;
  return avecZero.replace(/(\d{2})(?=\d)/g, "$1 ");
};
