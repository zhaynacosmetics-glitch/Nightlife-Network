// Données de démonstration : TOUTES FICTIVES.
// Elles servent uniquement à illustrer le concept dans le film et sur le site.
// Le modèle de calcul est volontairement simple et transparent.

import type { Verdict } from "./brand";

export interface Ride {
  id: string;
  platform: string;
  price: number; // € proposés au chauffeur
  approachKm: number;
  approachMin: number;
  tripKm: number;
  tripMin: number;
  returnKm?: number; // retour à vide estimé, si pertinent
  returnMin?: number;
  from: string;
  to: string;
}

export interface Costs {
  perKm: number; // coût variable estimé par km (énergie, entretien, pneus, usure…)
}

export interface Prefs {
  greenFrom: number; // €/h net estimé à partir duquel la course est « potentiellement rentable »
  orangeFrom: number; // €/h en dessous duquel elle est « potentiellement peu rentable »
}

export const DEMO_COSTS: Costs = { perKm: 0.32 };
export const DEMO_PREFS: Prefs = { greenFrom: 25, orangeFrom: 15 };

/** Course principale de la démonstration (Paris 10e → Orly). */
export const RIDE_MAIN: Ride = {
  id: "main",
  platform: "Plateforme VTC (exemple)",
  price: 34.5,
  approachKm: 3.2,
  approachMin: 8,
  tripKm: 18.6,
  tripMin: 38,
  from: "Paris 10e",
  to: "Aéroport d’Orly (94)",
};

/** Course « piège » du film : prix attractif, rentabilité faible. */
export const RIDE_TRAP: Ride = {
  id: "trap",
  platform: "Plateforme VTC (exemple)",
  price: 32,
  approachKm: 16,
  approachMin: 25,
  tripKm: 28,
  tripMin: 52,
  returnKm: 20,
  returnMin: 30,
  from: "Paris 20e",
  to: "Aéroport de Roissy (95)",
};

/** Course intermédiaire. */
export const RIDE_MID: Ride = {
  id: "mid",
  platform: "Plateforme VTC (exemple)",
  price: 21,
  approachKm: 6,
  approachMin: 14,
  tripKm: 12,
  tripMin: 27,
  from: "Boulogne (92)",
  to: "Paris 13e",
};

export interface Estimate {
  totalKm: number;
  totalMin: number;
  costs: number;
  net: number;
  hourly: number;
  verdict: Verdict;
}

export function estimate(r: Ride, c: Costs = DEMO_COSTS, prefs: Prefs = DEMO_PREFS): Estimate {
  const totalKm = r.approachKm + r.tripKm + (r.returnKm ?? 0);
  const totalMin = r.approachMin + r.tripMin + (r.returnMin ?? 0);
  const costs = totalKm * c.perKm;
  const net = r.price - costs;
  const hourly = net / (totalMin / 60);
  const verdict: Verdict = hourly >= prefs.greenFrom ? "green" : hourly >= prefs.orangeFrom ? "orange" : "red";
  return { totalKm, totalMin, costs, net, hourly, verdict };
}

/** Profil du chauffeur de la démonstration (fictif). */
export const DRIVER = {
  name: "Paul",
  vehicle: "Van",
  base: "Puteaux (92)",
  hours: "Nuit, 21 h – 5 h",
  focus: "Aéroports CDG et Orly",
} as const;
