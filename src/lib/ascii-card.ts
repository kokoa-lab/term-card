export interface CardData {
  name: string;
  title: string;
  github: string;
  skills: string[];
  email?: string;
  website?: string;
}

export type CardStyle = "neofetch" | "box" | "dotart" | "biglogo";

export type ColorTheme = "green" | "cyan" | "amber" | "rose" | "blue" | "purple";

export const COLOR_THEMES: Record<ColorTheme, { label: string; fg: string; accent: string; info: string; art: string }> = {
  green:  { label: "Matrix",  fg: "#66ff99", accent: "#66ff99", info: "#5eead4", art: "#f59e0b" },
  cyan:   { label: "Frost",   fg: "#67e8f9", accent: "#22d3ee", info: "#a78bfa", art: "#38bdf8" },
  amber:  { label: "Amber",   fg: "#fbbf24", accent: "#f59e0b", info: "#fb923c", art: "#fcd34d" },
  rose:   { label: "Sakura",  fg: "#fb7185", accent: "#f43f5e", info: "#f9a8d4", art: "#e879f9" },
  blue:   { label: "Ocean",   fg: "#60a5fa", accent: "#3b82f6", info: "#93c5fd", art: "#818cf8" },
  purple: { label: "Grape",   fg: "#c084fc", accent: "#a855f7", info: "#e879f9", art: "#f0abfc" },
};

// CJK/fullwidth chars occupy 2 columns in monospace
export function getDisplayWidth(str: string): number {
  let w = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0)!;
    if (
      (code >= 0x1100 && code <= 0x115F) ||
      (code >= 0x2E80 && code <= 0x303E) ||
      (code >= 0x3040 && code <= 0x309F) ||
      (code >= 0x30A0 && code <= 0x30FF) ||
      (code >= 0x3130 && code <= 0x318F) ||
      (code >= 0x3200 && code <= 0x32FF) ||
      (code >= 0x3400 && code <= 0x4DBF) ||
      (code >= 0x4E00 && code <= 0x9FFF) ||
      (code >= 0xAC00 && code <= 0xD7AF) ||
      (code >= 0xF900 && code <= 0xFAFF) ||
      (code >= 0xFE30 && code <= 0xFE4F) ||
      (code >= 0xFF01 && code <= 0xFF60) ||
      (code >= 0xFFE0 && code <= 0xFFE6) ||
      (code >= 0x20000 && code <= 0x2FA1F)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

function pad(str: string, len: number): string {
  const w = getDisplayWidth(str);
  if (w >= len) return str;
  return str + " ".repeat(len - w);
}

function centerPad(str: string, len: number): string {
  const w = getDisplayWidth(str);
  if (w >= len) return str;
  const left = Math.floor((len - w) / 2);
  const right = len - w - left;
  return " ".repeat(left) + str + " ".repeat(right);
}

// ===== BOX CARD (ASCII-only borders for reliable alignment) =====
const BOX_INNER = 44;

export function generateAsciiCard(data: CardData): string {
  const top    = "+" + "-".repeat(BOX_INNER + 2) + "+";
  const bottom = "+" + "-".repeat(BOX_INNER + 2) + "+";
  const empty  = "|" + " ".repeat(BOX_INNER + 2) + "|";
  const divider= "|" + " " + "-".repeat(BOX_INNER) + " " + "|";

  const lines: string[] = [];
  lines.push(top);
  lines.push(empty);
  lines.push("| " + centerPad(data.name, BOX_INNER) + " |");
  lines.push("| " + centerPad(data.title, BOX_INNER) + " |");
  lines.push(empty);
  lines.push(divider);
  lines.push(empty);

  const fields: [string, string][] = [];
  if (data.github) fields.push(["GitHub", "github.com/" + data.github]);
  if (data.email) fields.push(["Email", data.email]);
  if (data.website) fields.push(["Web", data.website]);
  if (data.skills.length > 0) fields.push(["Stack", data.skills.join(", ")]);

  for (const [label, value] of fields) {
    const combined = label + ": " + value;
    lines.push("| " + pad(combined, BOX_INNER) + " |");
  }

  lines.push(empty);
  lines.push("| " + centerPad("### ### ### ### ### ###", BOX_INNER) + " |");
  lines.push(empty);
  lines.push(bottom);

  return lines.join("\n");
}

// ===== NEOFETCH (no strict box alignment needed) =====
export function generateNeofetchCard(data: CardData): string {
  const ascii = [
    "   .+------+.   ",
    "   |  ><>   |   ",
    "   |   .--. |   ",
    "   |   |##| |   ",
    "   |   '--' |   ",
    "   |  TERM  |   ",
    "   |  CARD  |   ",
    "   '+------+'   ",
  ];

  const infoLines: string[] = [];
  infoLines.push(data.name);
  infoLines.push("-".repeat(getDisplayWidth(data.name)));
  if (data.title) infoLines.push("Title: " + data.title);
  if (data.github) infoLines.push("GitHub: github.com/" + data.github);
  if (data.email) infoLines.push("Email: " + data.email);
  if (data.website) infoLines.push("Web: " + data.website);
  if (data.skills.length > 0) infoLines.push("Stack: " + data.skills.join(", "));
  infoLines.push("");
  infoLines.push("### ### ### ### ### ### ### ###");

  const maxLines = Math.max(ascii.length, infoLines.length);
  const result: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    const left = i < ascii.length ? ascii[i] : " ".repeat(17);
    const right = i < infoLines.length ? infoLines[i] : "";
    result.push(left + right);
  }
  return result.join("\n");
}

// ===== DOT ART =====
export function generateDotArtCard(data: CardData): string {
  const dotAvatar = [
    "  .  . . .  .  ",
    " . .       . . ",
    ".    o   o    .",
    ".      v      .",
    " . .       . . ",
    "  .  . . .  .  ",
  ];

  const lines: string[] = [];
  lines.push(". . . . . . . . . . . . . . . .");
  lines.push("");

  for (const row of dotAvatar) {
    lines.push("  " + centerPad(row, 28));
  }

  lines.push("");
  lines.push("  " + centerPad("~ " + data.name + " ~", 28));
  lines.push("  " + centerPad(data.title, 28));
  lines.push("");

  if (data.github) lines.push("  * github.com/" + data.github);
  if (data.email) lines.push("  * " + data.email);
  if (data.website) lines.push("  * " + data.website);
  if (data.skills.length > 0) lines.push("  * " + data.skills.join(", "));

  lines.push("");
  lines.push(". . . . . . . . . . . . . . . .");

  return lines.join("\n");
}

// ===== BIG LOGO =====
export function generateBigLogoCard(data: CardData): string {
  const LOGO_INNER = 35;
  const logo = [
    " ######  ###### ",
    "   ##   ##      ",
    "   ##   ##      ",
    "   ##   ##      ",
    "   ##    ###### ",
  ];

  const lines: string[] = [];
  lines.push("+" + "=".repeat(LOGO_INNER + 4) + "+");

  for (const row of logo) {
    lines.push("|  " + pad(row, LOGO_INNER) + "  |");
  }

  lines.push("|" + " ".repeat(LOGO_INNER + 4) + "|");
  lines.push("|  " + pad(data.name, LOGO_INNER) + "  |");
  lines.push("|  " + pad(data.title, LOGO_INNER) + "  |");
  lines.push("|" + " ".repeat(LOGO_INNER + 4) + "|");
  lines.push("|  " + pad("-".repeat(LOGO_INNER), LOGO_INNER) + "  |");
  lines.push("|" + " ".repeat(LOGO_INNER + 4) + "|");

  if (data.github) lines.push("|  " + pad("> github.com/" + data.github, LOGO_INNER) + "  |");
  if (data.email) lines.push("|  " + pad("> " + data.email, LOGO_INNER) + "  |");
  if (data.website) lines.push("|  " + pad("> " + data.website, LOGO_INNER) + "  |");
  if (data.skills.length > 0) lines.push("|  " + pad("> " + data.skills.join(" | "), LOGO_INNER) + "  |");

  lines.push("|" + " ".repeat(LOGO_INNER + 4) + "|");
  lines.push("|  " + pad("### ### ### ### ### ###", LOGO_INNER) + "  |");
  lines.push("|" + " ".repeat(LOGO_INNER + 4) + "|");
  lines.push("+" + "=".repeat(LOGO_INNER + 4) + "+");

  return lines.join("\n");
}

export function generateCard(data: CardData, style: CardStyle): string {
  switch (style) {
    case "neofetch": return generateNeofetchCard(data);
    case "box": return generateAsciiCard(data);
    case "dotart": return generateDotArtCard(data);
    case "biglogo": return generateBigLogoCard(data);
  }
}
