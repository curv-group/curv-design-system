/**
 * Runtime cap for page-shell slots (vitals, kpis, charts). TypeScript tuples
 * catch the mistake at compile time; this is the backstop when an array is
 * passed. Extra items are not rendered — they belong in a tab, drawer, or
 * hover breakdown.
 */
export function capSlot<T>(
  slot: string,
  items: readonly T[] | undefined,
  max: number,
  hint: string,
): T[] {
  if (!items || items.length === 0) return [];
  if (items.length > max) {
    console.warn(
      `[Curv ${slot}] ${items.length} items passed; max is ${max}. ${hint} Extra items are not rendered.`,
    );
    return items.slice(0, max) as T[];
  }
  return items as T[];
}

/** 0–4 items. A 5th vital belongs in a tab or a StatCard breakdown. */
export type AtMost4<T> =
  | readonly []
  | readonly [T]
  | readonly [T, T]
  | readonly [T, T, T]
  | readonly [T, T, T, T];

/** 0–5 items. A 6th KPI belongs in a tab, not on the dashboard canvas. */
export type AtMost5<T> = AtMost4<T> | readonly [T, T, T, T, T];

/** 0–2 items. A 3rd chart belongs in a tab. */
export type AtMost2<T> = readonly [] | readonly [T] | readonly [T, T];
