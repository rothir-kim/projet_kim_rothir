// Renvoie null si l'id n'est pas un nombre valide (ex : /pollutions/abc).
export function lireId(valeur: string | null): number | null {
  const id = Number(valeur);
  return valeur !== null && Number.isInteger(id) && id > 0 ? id : null;
}
