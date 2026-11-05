// Un jour de marge : le serveur Render est en heure UTC, pas à l'heure française
export const pasDansLeFutur = (valeur: unknown): void => {
  const demain = new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (new Date(String(valeur)) > demain) {
    throw new Error("La date ne peut pas être dans le futur");
  }
};

export const urlHttp = (valeur: unknown): void => {
  if (valeur === null || valeur === undefined) {
    return;
  }
  try {
    const { protocol } = new URL(String(valeur));
    if (protocol === "http:" || protocol === "https:") {
      return;
    }
  } catch {
    // l'URL n'a pas pu être lue, on tombe sur l'erreur ci-dessous
  }
  throw new Error("La photo doit être une URL commençant par http:// ou https://");
};

export const motDePasseRobuste = (valeur: unknown): void => {
  const texte = String(valeur ?? "");
  const valide =
    texte.length >= 8 &&
    /[a-z]/.test(texte) &&
    /[A-Z]/.test(texte) &&
    /[0-9]/.test(texte) &&
    /[^a-zA-Z0-9]/.test(texte);
  if (!valide) {
    throw new Error(
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
    );
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
