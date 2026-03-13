import type { LotteryEntry } from '../types';

interface ExpandedEntry extends LotteryEntry {
  chanceId: string;
}

/**
 * Randomly selects winners from a list of lottery entries.
 * Each entry can have quantity > 1, so we expand entries into individual chances.
 */
export function selectWinners(
  entries: LotteryEntry[],
  winnerCount = 1
): ExpandedEntry[] {
  const expanded: ExpandedEntry[] = [];
  entries.forEach((entry) => {
    for (let i = 0; i < entry.quantity; i++) {
      expanded.push({ ...entry, chanceId: `${entry.id}-${i}` });
    }
  });

  if (expanded.length === 0 || winnerCount <= 0) return [];
  const count = Math.min(winnerCount, expanded.length);

  const winners: ExpandedEntry[] = [];
  const used = new Set<string>();

  while (winners.length < count) {
    const idx = Math.floor(Math.random() * expanded.length);
    const candidate = expanded[idx];
    if (!used.has(candidate.chanceId)) {
      used.add(candidate.chanceId);
      winners.push(candidate);
    }
  }

  return winners;
}