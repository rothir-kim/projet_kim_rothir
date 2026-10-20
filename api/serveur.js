import { readFileSync } from 'node:fs';
import cors from 'cors';
import express from 'express';

const TYPES = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];
const PORT = process.env.PORT ?? 3000;
const ORIGINES = (process.env.ORIGINES_AUTORISEES ?? 'http://localhost:4200')
  .split(',')
  .map((origine) => origine.trim());

const pollutions = JSON.parse(
  readFileSync(new URL('./pollutions.json', import.meta.url), 'utf-8')
);
let prochainId = Math.max(0, ...pollutions.map((pollution) => pollution.id)) + 1;

const estTexte = (valeur, longueurMax) =>
  typeof valeur === 'string' && valeur.trim() !== '' && valeur.trim().length <= longueurMax;

const estNombreEntre = (valeur, min, max) =>
  typeof valeur === 'number' && Number.isFinite(valeur) && valeur >= min && valeur <= max;

const estDateValide = (valeur) => {
  if (typeof valeur !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) {
    return false;
  }
  const date = new Date(`${valeur}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(valeur);
};

const estDateNonFuture = (valeur) =>
  valeur <= new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString().slice(0, 10);

const estUrlHttp = (valeur) => {
  try {
    const { protocol } = new URL(valeur);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const nettoyerPollution = (corps) => {
  if (typeof corps !== 'object' || corps === null) {
    return null;
  }
  const { titre, type, description, date, lieu, latitude, longitude, urlPhoto } = corps;
  const photoAbsente = urlPhoto === undefined || urlPhoto === null || urlPhoto === '';
  const photoValide =
    photoAbsente ||
    (typeof urlPhoto === 'string' && urlPhoto.length <= 500 && estUrlHttp(urlPhoto.trim()));
  const donneesValides =
    estTexte(titre, 120) &&
    TYPES.includes(type) &&
    estTexte(description, 2000) &&
    estDateValide(date) &&
    estDateNonFuture(date) &&
    estTexte(lieu, 200) &&
    estNombreEntre(latitude, -90, 90) &&
    estNombreEntre(longitude, -180, 180) &&
    photoValide;
  if (!donneesValides) {
    return null;
  }
  return {
    titre: titre.trim(),
    type,
    description: description.trim(),
    date,
    lieu: lieu.trim(),
    latitude,
    longitude,
    ...(photoAbsente ? {} : { urlPhoto: urlPhoto.trim() }),
  };
};

const trouverIndex = (requete) => {
  const id = Number(requete.params.id);
  return pollutions.findIndex((pollution) => pollution.id === id);
};

const application = express();
application.disable('x-powered-by');
application.use(cors({ origin: ORIGINES }));
application.use(express.json({ limit: '10kb' }));

application.get('/', (_requete, reponse) => {
  reponse.json({ statut: 'ok' });
});

application.get('/api/pollutions', (_requete, reponse) => {
  const triees = [...pollutions].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id
  );
  reponse.json(triees);
});

application.get('/api/pollutions/:id', (requete, reponse) => {
  const index = trouverIndex(requete);
  if (index === -1) {
    return reponse.status(404).json({ message: 'Pollution introuvable' });
  }
  return reponse.json(pollutions[index]);
});

application.post('/api/pollutions', (requete, reponse) => {
  const donnees = nettoyerPollution(requete.body);
  if (!donnees) {
    return reponse.status(400).json({ message: 'Données invalides' });
  }
  const pollution = { id: prochainId++, ...donnees };
  pollutions.push(pollution);
  return reponse.status(201).json(pollution);
});

application.put('/api/pollutions/:id', (requete, reponse) => {
  const index = trouverIndex(requete);
  if (index === -1) {
    return reponse.status(404).json({ message: 'Pollution introuvable' });
  }
  const donnees = nettoyerPollution(requete.body);
  if (!donnees) {
    return reponse.status(400).json({ message: 'Données invalides' });
  }
  pollutions[index] = { id: pollutions[index].id, ...donnees };
  return reponse.json(pollutions[index]);
});

application.delete('/api/pollutions/:id', (requete, reponse) => {
  const index = trouverIndex(requete);
  if (index === -1) {
    return reponse.status(404).json({ message: 'Pollution introuvable' });
  }
  pollutions.splice(index, 1);
  return reponse.status(204).end();
});

application.use((_requete, reponse) => {
  reponse.status(404).json({ message: 'Route inconnue' });
});

application.use((erreur, _requete, reponse, _suite) => {
  const statut = erreur.status === 400 || erreur.status === 413 ? erreur.status : 500;
  reponse
    .status(statut)
    .json({ message: statut === 500 ? 'Erreur serveur' : 'Requête invalide' });
});

application.listen(PORT, () => {
  console.log(`API des pollutions disponible sur le port ${PORT}`);
});
