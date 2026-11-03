import { useSyncExternalStore } from "react";

/** The phrase the wax seals spell out, one letter per seal, in page order. */
export const SEAL_PHRASE = "STAY CURIOUS";
export const SEAL_LETTERS = SEAL_PHRASE.replace(/ /g, "").split("");

/** Every collectible seal, in the order it appears on the page. Its index is its letter's slot. */
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
];

export const sealIndex = (label: string) => SEAL_ORDER.indexOf(label);

const KEY = "dw-seals-v1";
let collected: string[] = [];
try {
  const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  if (Array.isArray(raw)) collected = raw.filter((l) => SEAL_ORDER.includes(l));
} catch {
  /* private mode or blocked storage: start empty */
}
const listeners = new Set<() => void>();

export function collectSeal(label: string) {
  if (sealIndex(label) < 0 || collected.includes(label)) return;
  collected = [...collected, label];
  try {
    localStorage.setItem(KEY, JSON.stringify(collected));
  } catch {
    /* keep it in memory only */
  }
  listeners.forEach((f) => f());
}

export function resetSeals() {
  collected = [];
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
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
