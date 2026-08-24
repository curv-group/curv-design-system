#!/usr/bin/env node
/**
 * Minimal stdio MCP server for the Curv design system.
 * JSON-RPC messages, one per line (MCP stdio).
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import {
  search,
  composePage,
  getComponent,
  validateUsage,
  SHELLS,
} from "./catalog.mjs";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function skillText() {
  return fs.readFileSync(path.join(pkgRoot, "skills/curv-ui/SKILL.md"), "utf8");
}

function exampleText(rel) {
  const abs = path.join(pkgRoot, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

const TOOLS = [
  {
    name: "search",
    description: "Search Curv page shells and components by intent (list, product screen, dashboard, P&L, settings, DataTable, …).",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "compose_page",
    description: "Turn a whole-page intent into the one Curv page shell to copy. Prefer this over assembling primitives.",
    inputSchema: {
      type: "object",
      properties: { intent: { type: "string" } },
      required: ["intent"],
    },
  },
  {
    name: "get_component",
    description: "Return the real slots/props for a Curv shell or component. Never guess APIs.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  {
    name: "get_examples",
    description: "Return the copyable example source for a page shell (ListPage, DetailPage, …).",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  {
    name: "validate_usage",
    description: "Check planned prop names against the documented API before writing code.",
    inputSchema: {
      type: "object",
      properties: {
        component: { type: "string" },
        props: {
          oneOf: [
            { type: "array", items: { type: "string" } },
            { type: "object" },
          ],
        },
      },
      required: ["component", "props"],
    },
  },
  {
    name: "get_agent_skill",
    description: "Return the Curv UI skill (the workflow brain) for agents that cannot install files.",
    inputSchema: { type: "object", properties: {} },
  },
];

function textResult(obj) {
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  return { content: [{ type: "text", text }] };
}

function callTool(name, args = {}) {
  switch (name) {
    case "search":
      return textResult(search(args.query));
    case "compose_page":
      return textResult(composePage(args.intent));
    case "get_component":
      return textResult(getComponent(args.name));
    case "get_examples": {
      const info = getComponent(args.name);
      if (!info.found || !info.example) {
        return textResult({
          found: false,
          hint: `No example for ${args.name}. Shells: ${SHELLS.map((s) => s.name).join(", ")}`,
        });
      }
      return textResult({ name: info.name, path: info.example, source: exampleText(info.example) });
    }
    case "validate_usage":
      return textResult(validateUsage(args));
    case "get_agent_skill":
      return textResult(skillText());
    default:
      return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
}

function respond(id, result) {
  if (id === undefined || id === null) return;
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function respondError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");
}

async function handle(msg) {
  const { id, method, params } = msg;
  if (method === "initialize") {
    respond(id, {
      protocolVersion: params?.protocolVersion || "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "curv-design-system", version: "0.3.0" },
    });
    return;
  }
  if (method === "notifications/initialized" || method === "initialized") return;
  if (method === "tools/list") {
    respond(id, { tools: TOOLS });
    return;
  }
  if (method === "tools/call") {
    const name = params?.name;
    const args = params?.arguments || {};
    try {
      respond(id, callTool(name, args));
    } catch (err) {
      respondError(id, -32000, err instanceof Error ? err.message : String(err));
    }
    return;
  }
  if (method === "ping") {
    respond(id, {});
    return;
  }
  if (id != null) respondError(id, -32601, `Method not found: ${method}`);
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    handle(JSON.parse(trimmed));
  } catch (err) {
    respondError(null, -32700, err instanceof Error ? err.message : "parse error");
  }
});
