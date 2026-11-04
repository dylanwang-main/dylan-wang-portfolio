import { useSyncExternalStore } from "react";

/** The phrase the wax seals spell out, one letter per seal, in page order. */
export const SEAL_PHRASE = "STAY CURIOUS TODAY";
export const SEAL_LETTERS = SEAL_PHRASE.replace(/ /g, "").split("");

/** Every collectible seal, in the order it appears on the page. */
export const SEAL_ORDER = [
  "Power BI",
  "Python",
  "Excel",
  "Keyword targeting",
  "Site structure",
  "Content updates",
  "Mobile optimization",
  "Non-followers",
  "Reels tab",
  "Watch time",
  "Interactions",
  "about:UC San Diego",
  "about:Content Creator",
  "about:Python",
  "about:Power BI",
  "about:Mandarin Chinese",
];

/**
 * Which letter slot each seal fills, by page order. Shuffled on purpose, so reading the seals top
 * to bottom does not give the phrase away (the page reads U Y A · S O R T A · Y T D C I S).
 */
const SLOT_FOR_PAGE = [9, 3, 14, 0, 12, 6, 11, 2, 15, 7, 1, 13, 4, 10, 5, 8];

/** The phrase slot a seal fills, or -1 if the label is not a collectible seal. */
export const sealIndex = (label: string) => {
  const p = SEAL_ORDER.indexOf(label);
  return p < 0 ? -1 : SLOT_FOR_PAGE[p];
};
/** The seal that fills a given phrase slot. */
export const labelForSlot = (slot: number) => SEAL_ORDER[SLOT_FOR_PAGE.indexOf(slot)];

// Every visit starts with all seals unfound (progress lives only for the page's lifetime).
// Clear the key older versions saved, so returning visitors start fresh too.
const KEY = "dw-seals-v1";
try {
  localStorage.removeItem(KEY);
} catch {
  /* storage blocked: nothing to clear */
}
let collected: string[] = [];
const listeners = new Set<() => void>();

export function collectSeal(label: string) {
  if (sealIndex(label) < 0 || collected.includes(label)) return;
  collected = [...collected, label];
  listeners.forEach((f) => f());
}

export function resetSeals() {
  collected = [];
  listeners.forEach((f) => f());
}

const subscribe = (f: () => void) => {
  listeners.add(f);
  return () => listeners.delete(f);
};

/** Labels of the seals this visitor has collected (stable array; changes only on collect). */
export function useSeals() {
  return useSyncExternalStore(subscribe, () => collected, () => collected);
}

/** The letter a seal carries (its slot in the phrase), or its own initial if it is not collectible. */
export const sealGlyph = (label: string) => {
  const i = sealIndex(label);
  return i >= 0 ? SEAL_LETTERS[i] : label.charAt(0);
};

/* ---------- flights: a collected seal flies from where it was clicked to its slot ---------- */
export interface Flight {
  id: number;
  label: string;
  from: { x: number; y: number; size: number };
}
let flights: Flight[] = [];
let nextId = 1;
const flightListeners = new Set<() => void>();
const emitFlights = () => flightListeners.forEach((f) => f());

/** Start a seal's flight to its slot. It is added to the collection when it lands. */
export function launchSeal(label: string, rect: DOMRect) {
  if (sealIndex(label) < 0 || collected.includes(label) || flights.some((f) => f.label === label)) return;
  flights = [...flights, { id: nextId++, label, from: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width } }];
  emitFlights();
}
export function landSeal(id: number) {
  const f = flights.find((x) => x.id === id);
  flights = flights.filter((x) => x.id !== id);
  emitFlights();
  if (f) collectSeal(f.label);
}
const subFlights = (f: () => void) => {
  flightListeners.add(f);
  return () => flightListeners.delete(f);
};
export function useFlights() {
  return useSyncExternalStore(subFlights, () => flights, () => flights);
}

/** How the finished phrase is written once every seal is found. */
export const SEAL_DONE_TEXT = "Stay Curious Today!";
