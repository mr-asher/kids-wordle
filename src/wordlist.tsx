export const GOLDEN_WORDS = [
  "a",
  "and",
  "be",
  "I",
  "in",
  "is",
  "it",
  "of",
  "that",
  "the",
  "to",
  "was",
];

export const TEDDY_WORDS = [
  "her",
  "of",
  "are",
  "too",
  "for",
  "see",
  "he",
  "she",
  "we",
  "was",
  "to",
  "do",
];

export const WORD_LISTS = {
  "Golden Words": GOLDEN_WORDS,
  "Teddy Words": TEDDY_WORDS,
} as const;

export type WordListKey = keyof typeof WORD_LISTS;

export function getWordList(key: WordListKey | "All Lists"): string[] {
  if (key === "All Lists") {
    return Object.values(WORD_LISTS).flat();
  }
  return WORD_LISTS[key];
}
