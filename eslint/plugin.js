/**
 * eslint-plugin-curv — mechanical guards for the Curv design language.
 *
 * These catch the exact mistakes a human (or an agent) makes when they write UI
 * without reading docs/design-system.md: full uppercase and raw hex colours
 * instead of tokens. They scan the *static* strings inside every `className`
 * (including inside `cn(...)`, arrays and template literals), so deviations fail
 * CI instead of reaching a review.
 *
 * Radius is deliberately NOT linted: it's a concentric (relational) rule now
 * (outer = inner + padding), which a linter can't compute — curv-ui and the
 * design-review agent own it.
 *
 * They are deliberately narrow and deterministic. Taste-level judgment (clutter,
 * hierarchy, "does this need to exist") is the design-review agent's job, not
 * lint's.
 */

// The only sanctioned raw hex: the top-bar chrome colour, fixed in both themes
// (see design-system.md → App shell). Everything else must be a token.
const HEX_ALLOWLIST = new Set(["1b1b1b"]);

/** Strip Tailwind variant prefixes (`sm:`, `hover:`, `dark:`) → the base utility. */
function baseUtility(token) {
  const parts = token.split(":");
  return parts[parts.length - 1];
}

/** Collect every static string reachable inside a className attribute value. */
function collectStrings(node, out) {
  if (!node) return;
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") out.push({ text: node.value, node });
      break;
    case "TemplateLiteral":
      for (const q of node.quasis) out.push({ text: q.value.cooked ?? "", node: q });
      break;
    case "JSXExpressionContainer":
      collectStrings(node.expression, out);
      break;
    case "CallExpression":
      for (const arg of node.arguments) collectStrings(arg, out);
      break;
    case "ArrayExpression":
      for (const el of node.elements) collectStrings(el, out);
      break;
    case "LogicalExpression":
      collectStrings(node.left, out);
      collectStrings(node.right, out);
      break;
    case "ConditionalExpression":
      collectStrings(node.consequent, out);
      collectStrings(node.alternate, out);
      break;
    default:
      break;
  }
}

function classNameStrings(attr) {
  if (!attr.value) return [];
  const out = [];
  collectStrings(attr.value, out);
  return out;
}

function tokensOf(text) {
  return text.split(/\s+/).filter(Boolean);
}

/** Build a rule that reports any className token matching `test(base, raw)`. */
function makeClassRule({ description, messageId, message, test }) {
  return {
    meta: {
      type: "problem",
      docs: { description },
      schema: [],
      messages: { [messageId]: message },
    },
    create(context) {
      return {
        JSXAttribute(attr) {
          const name = attr.name && attr.name.name;
          if (name !== "className" && name !== "class") return;
          for (const { text, node } of classNameStrings(attr)) {
            for (const raw of tokensOf(text)) {
              const hit = test(baseUtility(raw), raw);
              if (hit) {
                context.report({ node, messageId, data: { token: raw, ...hit } });
              }
            }
          }
        },
      };
    },
  };
}

const HEX_ARBITRARY = /\[#([0-9a-fA-F]{3,8})\]/;

// Tailwind's default colour scales. Banned in className — a raw `bg-neutral-100`
// or `border-amber-400` bypasses the theme and drifts from every other OS. Use a
// semantic token instead (bg-background/-card/-muted, text-foreground/
// -muted-foreground, border-border, the verdict-*/chart-* families). This is the
// rule that catches a page shell hand-rolled with `bg-neutral-100` instead of
// `bg-background`. `black`/`white` are NOT scales, so `outline-black/10` (the
// sanctioned image-outline) and `bg-white/10` stay legal.
const PALETTE_SCALE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|" +
  "emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PALETTE_PREFIX =
  "bg|text|border|border-[trblxyse]|ring|ring-offset|from|via|to|fill|" +
  "stroke|divide|outline|placeholder|caret|accent|decoration|shadow";
const PALETTE_UTILITY = new RegExp(
  `^(?:${PALETTE_PREFIX})-(?:${PALETTE_SCALE})-\\d{2,3}(?:\\/\\d{1,3})?$`,
);

const rules = {
  "no-local-data-table-primitive": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Require the shared DataTable instead of a local DataTable or StandardTable primitive.",
      },
      schema: [],
      messages: {
        localTable:
          "Do not create or import a local {{name}}. Use DataTable from @curvgroup/design-system and improve it upstream when needed.",
      },
    },
    create(context) {
      const banned = new Set(["DataTable", "StandardTable"]);
      const reportIdentifier = (node) => {
        if (node?.type === "Identifier" && banned.has(node.name)) {
          context.report({ node, messageId: "localTable", data: { name: node.name } });
        }
      };
      return {
        ImportDeclaration(node) {
          if (node.source.value === "@curvgroup/design-system") return;
          for (const specifier of node.specifiers) {
            if (specifier.type === "ImportSpecifier") {
              if (specifier.imported.type === "Identifier" && banned.has(specifier.imported.name)) {
                reportIdentifier(specifier.imported);
              } else {
                reportIdentifier(specifier.local);
              }
            } else {
              reportIdentifier(specifier.local);
            }
          }
        },
        FunctionDeclaration(node) {
          reportIdentifier(node.id);
        },
        ClassDeclaration(node) {
          reportIdentifier(node.id);
        },
        VariableDeclarator(node) {
          reportIdentifier(node.id);
        },
      };
    },
  },
  "no-uppercase-utility": makeClassRule({
    description: "Disallow full-uppercase / wide-tracking label styles.",
    messageId: "noUppercase",
    message:
      'Avoid "{{token}}". design-system.md forbids full uppercase and wide tracking — use sentence case.',
    test: (base) =>
      base === "uppercase" || base === "tracking-wider" || base === "tracking-widest"
        ? {}
        : null,
  }),
  "no-raw-hex": makeClassRule({
    description: "Disallow raw hex colours in className; use theme tokens.",
    messageId: "noRawHex",
    message:
      'Raw hex "{{token}}" — use a theme token (bg-card, text-muted-foreground, …) instead of a hardcoded colour.',
    test: (_base, raw) => {
      const m = raw.match(HEX_ARBITRARY);
      if (!m) return null;
      return HEX_ALLOWLIST.has(m[1].toLowerCase()) ? null : {};
    },
  }),
  "no-palette-utility": makeClassRule({
    description:
      "Disallow raw Tailwind colour-scale utilities in className; use theme tokens.",
    messageId: "noPalette",
    message:
      'Raw palette utility "{{token}}" — use a semantic token (bg-background, bg-card, bg-muted, text-foreground, text-muted-foreground, border-border, or the verdict-*/chart-* families) instead of a Tailwind default colour scale.',
    test: (base) => (PALETTE_UTILITY.test(base) ? {} : null),
  }),
};

export default { rules, meta: { name: "eslint-plugin-curv" } };
