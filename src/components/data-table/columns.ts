export type MobilePriority = "primary" | "secondary" | "hidden";

export type ColumnLayout = {
  key: string;
  locked?: boolean;
  mobilePriority?: MobilePriority;
};

export function lockedKeys(columns: readonly ColumnLayout[]): string[] {
  return columns.filter((column) => column.locked).map((column) => column.key);
}

export function optionalKeys(columns: readonly ColumnLayout[]): string[] {
  return columns.filter((column) => !column.locked).map((column) => column.key);
}

export function defaultVisibleKeys(columns: readonly ColumnLayout[]): string[] {
  return columns.map((column) => column.key);
}

export function defaultOrderKeys(columns: readonly ColumnLayout[]): string[] {
  return columns.map((column) => column.key);
}

export function sanitizeVisibleKeys(columns: readonly ColumnLayout[], raw: unknown): string[] {
  const allowed = new Set(optionalKeys(columns));
  const locked = lockedKeys(columns);
  if (!Array.isArray(raw) || raw.length === 0) return defaultVisibleKeys(columns);
  const wanted = new Set(raw.filter((key): key is string => typeof key === "string" && allowed.has(key)));
  return [...locked, ...optionalKeys(columns).filter((key) => wanted.has(key))];
}

export function sanitizeOrderKeys(columns: readonly ColumnLayout[], raw: unknown): string[] {
  const known = new Set(columns.map((column) => column.key));
  const locked = lockedKeys(columns);
  if (!Array.isArray(raw) || raw.length === 0) return defaultOrderKeys(columns);
  const seen = new Set<string>();
  const optional: string[] = [];
  for (const key of raw) {
    if (typeof key !== "string" || !known.has(key) || seen.has(key)) continue;
    seen.add(key);
    if (!locked.includes(key)) optional.push(key);
  }
  for (const key of optionalKeys(columns)) {
    if (!seen.has(key)) optional.push(key);
  }
  return [...locked, ...optional];
}

export function visibleOrderedKeys(
  columns: readonly ColumnLayout[],
  visible: readonly string[],
  order: readonly string[],
): string[] {
  const shown = new Set(sanitizeVisibleKeys(columns, visible));
  return sanitizeOrderKeys(columns, order).filter((key) => shown.has(key));
}

export function moveOptionalColumn(
  columns: readonly ColumnLayout[],
  order: readonly string[],
  key: string,
  direction: -1 | 1,
): string[] {
  const next = sanitizeOrderKeys(columns, order);
  const locked = lockedKeys(columns);
  if (locked.includes(key)) return next;
  const index = next.indexOf(key);
  const target = index + direction;
  if (index < 0 || target < locked.length || target >= next.length) return next;
  const copy = [...next];
  const [item] = copy.splice(index, 1);
  copy.splice(target, 0, item);
  return copy;
}

export function reorderOptionalColumn(
  columns: readonly ColumnLayout[],
  order: readonly string[],
  key: string,
  beforeKey: string | null,
): string[] {
  const next = sanitizeOrderKeys(columns, order);
  const locked = lockedKeys(columns);
  if (locked.includes(key) || (beforeKey && locked.includes(beforeKey))) return next;
  const without = next.filter((item) => item !== key);
  const insertAt = beforeKey ? without.indexOf(beforeKey) : without.length;
  if (insertAt < locked.length) return next;
  without.splice(insertAt, 0, key);
  return sanitizeOrderKeys(columns, without);
}

export function mobileKeys(columns: readonly ColumnLayout[], visible: readonly string[]): {
  primary: string[];
  secondary: string[];
} {
  const shown = visibleOrderedKeys(columns, visible, visible);
  const byKey = new Map(columns.map((column) => [column.key, column]));
  const primary: string[] = [];
  const secondary: string[] = [];
  for (const key of shown) {
    const column = byKey.get(key);
    if (!column) continue;
    const priority = column.mobilePriority ?? (column.locked ? "secondary" : "secondary");
    if (priority === "hidden") continue;
    if (priority === "primary") primary.push(key);
    else secondary.push(key);
  }
  if (primary.length === 0 && shown[0]) {
    primary.push(shown[0]);
    return { primary, secondary: secondary.filter((key) => key !== shown[0]) };
  }
  return { primary, secondary };
}
