/**
 * Family hierarchy for catalog tables (Inventory / Products).
 *
 * - Sort parents only. Children stay under their parent in source order.
 * - If a parent or any child matches search, keep the parent and every sibling.
 *   A SKU query must not collapse the family to one row.
 * - Expansion is a set of parent ids. Children render only when the parent is open.
 * - Child row ids are `${parentId}::${childId}`.
 */

export type HierarchyRow<Row> = {
  row: Row;
  id: string;
  parentId: string | null;
  depth: 0 | 1;
  hasChildren: boolean;
  expanded: boolean;
};

export function childRowId(parentId: string, childId: string): string {
  return `${parentId}::${childId}`;
}

export function flattenHierarchy<Row>(
  parents: readonly Row[],
  expanded: ReadonlySet<string>,
  getRowId: (row: Row, index: number) => string,
  getSubRows: ((row: Row) => Row[] | undefined) | undefined,
): HierarchyRow<Row>[] {
  if (!getSubRows) {
    return parents.map((row, index) => ({
      row,
      id: getRowId(row, index),
      parentId: null,
      depth: 0,
      hasChildren: false,
      expanded: false,
    }));
  }
  const out: HierarchyRow<Row>[] = [];
  parents.forEach((parent, index) => {
    const id = getRowId(parent, index);
    const children = getSubRows(parent) ?? [];
    const isOpen = expanded.has(id);
    out.push({
      row: parent,
      id,
      parentId: null,
      depth: 0,
      hasChildren: children.length > 1 || (children.length === 1 && getRowId(children[0], 0) !== id),
      expanded: isOpen,
    });
    if (!isOpen) return;
    children.forEach((child, childIndex) => {
      const cid = getRowId(child, childIndex);
      if (cid === id && children.length === 1) return;
      out.push({
        row: child,
        id: childRowId(id, cid),
        parentId: id,
        depth: 1,
        hasChildren: false,
        expanded: false,
      });
    });
  });
  return out;
}

export function familyMatches<Row>(
  parent: Row,
  query: string,
  parentMatches: (row: Row) => boolean,
  getSubRows: ((row: Row) => Row[] | undefined) | undefined,
): boolean {
  if (!query.trim()) return true;
  if (parentMatches(parent)) return true;
  return (getSubRows?.(parent) ?? []).some((child) => parentMatches(child));
}

export function sortParents<Row>(
  parents: readonly Row[],
  compare: ((a: Row, b: Row) => number) | null,
): Row[] {
  if (!compare) return [...parents];
  return [...parents].sort(compare);
}

export function toggleExpanded(expanded: readonly string[], id: string): string[] {
  return expanded.includes(id) ? expanded.filter((item) => item !== id) : [...expanded, id];
}

export function expandedForQuery<Row>(
  parents: readonly Row[],
  query: string,
  expanded: readonly string[],
  getRowId: (row: Row, index: number) => string,
): Set<string> {
  const next = new Set(expanded);
  if (query.trim()) parents.forEach((row, index) => next.add(getRowId(row, index)));
  return next;
}
