#!/usr/bin/env node
/**
 * Curv design-system CLI.
 *
 *   node bin/cli.mjs init-agent   # write always-on rules into the current OS repo
 *   node bin/cli.mjs mcp          # stdio MCP server
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const MARK_START = "<!-- BEGIN CURV DESIGN SYSTEM -->";
const MARK_END = "<!-- END CURV DESIGN SYSTEM -->";

function read(rel) {
  return fs.readFileSync(path.join(pkgRoot, rel), "utf8");
}

function writeFile(abs, contents) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents);
  return abs;
}

function upsertMarked(abs, body) {
  const trimmed = body.trim();
  const block = `${MARK_START}\n${trimmed}\n${MARK_END}\n`;
  if (!fs.existsSync(abs)) {
    writeFile(abs, block);
    return;
  }
  const prev = fs.readFileSync(abs, "utf8");
  if (prev.includes(MARK_START) && prev.includes(MARK_END)) {
    const next = prev.replace(
      new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}\\n?`),
      block,
    );
    fs.writeFileSync(abs, next);
    return;
  }
  if (prev.trim() === trimmed) {
    writeFile(abs, block);
    return;
  }
  fs.writeFileSync(abs, `${prev.replace(/\s*$/, "\n\n")}${block}`);
}

function initAgent(cwd) {
  const skill = read("skills/curv-ui/SKILL.md");
  const agents = read("agent-kit/AGENTS.md");
  const claude = read("agent-kit/CLAUDE.md");
  const rule = read("agent-kit/curv.mdc");

  const written = [];
  written.push(writeFile(path.join(cwd, ".claude/skills/curv-ui/SKILL.md"), skill));
  written.push(writeFile(path.join(cwd, ".cursor/skills/curv-ui/SKILL.md"), skill));
  written.push(writeFile(path.join(cwd, ".cursor/rules/curv.mdc"), rule));
  upsertMarked(path.join(cwd, "AGENTS.md"), agents);
  upsertMarked(path.join(cwd, "CLAUDE.md"), claude);
  written.push(path.join(cwd, "AGENTS.md"), path.join(cwd, "CLAUDE.md"));

  console.log("Curv agent rules installed:");
  for (const f of written) console.log("  ", path.relative(cwd, f) || f);
  console.log("\nPlain-language prompts now map to page shells. Humans do not need to name DetailPage.");
}

const cmd = process.argv[2];

if (cmd === "init-agent") {
  initAgent(process.cwd());
} else if (cmd === "mcp") {
  const server = path.join(pkgRoot, "mcp/server.mjs");
  const child = spawn(process.execPath, [server], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  console.error(`Usage:
  npx @curvgroup/design-system init-agent   # write Cursor / Claude / AGENTS.md rules
  npx @curvgroup/design-system mcp          # stdio MCP (search, compose_page, …)`);
  process.exit(cmd ? 1 : 0);
}
