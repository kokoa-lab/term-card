import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import type { CardData } from "@/lib/ascii-card";
import { generateCard, COLOR_THEMES } from "@/lib/ascii-card";
import type { CardStyle, ColorTheme } from "@/lib/ascii-card";
import { Download, Copy, RotateCcw, Check } from "lucide-react";

interface Props {
  data: CardData;
}

const STYLES: { key: CardStyle; label: string }[] = [
  { key: "neofetch", label: "neofetch" },
  { key: "box", label: "boxcard" },
  { key: "dotart", label: "dotart" },
  { key: "biglogo", label: "biglogo" },
];

export default function AsciiCardDisplay({ data }: Props) {
  const [style, setStyle] = useState<CardStyle>("neofetch");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("green");
  const [trigger, setTrigger] = useState(0);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = COLOR_THEMES[colorTheme];
  const fullText = generateCard(data, style);
  const { displayed, isDone } = useTypingEffect(fullText, 6, trigger);

  const handleReplay = useCallback(() => setTrigger((t) => t + 1), []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullText]);

  const handleDownloadImage = useCallback(async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#141820",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "termcard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const colorBlocks = (seg: string, j: number) => {
    const blockColors = ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#1abc9c","#3498db","#9b59b6","#e91e63"];
    if (seg === "###") {
      return <span key={j} style={{ color: blockColors[Math.floor(j / 2) % 8], fontWeight: "bold" }}>###</span>;
    }
    return <span key={j}>{seg}</span>;
  };

  const renderColorized = (text: string) => {
    if (style === "neofetch") {
      return text.split("\n").map((line, i) => {
        const asciiPart = line.slice(0, 17);
        const infoPart = line.slice(17);
        const labelMatch = infoPart.match(/^(\w+)(: )(.*)/);

        return (
          <span key={i}>
            <span style={{ color: theme.art }}>{asciiPart}</span>
            {labelMatch ? (
              <>
                <span style={{ color: theme.info }} className="font-bold">{labelMatch[1]}</span>
                <span style={{ color: theme.fg, opacity: 0.5 }}>{labelMatch[2]}</span>
                <span style={{ color: theme.fg }}>{labelMatch[3]}</span>
              </>
            ) : infoPart.match(/^-+$/) ? (
              <span style={{ color: theme.fg, opacity: 0.4 }}>{infoPart}</span>
            ) : infoPart.includes("###") ? (
              <span>{infoPart.split(/(###)/).map(colorBlocks)}</span>
            ) : (
              <span style={{ color: theme.fg }} className="font-bold">{infoPart}</span>
            )}
            {"\n"}
          </span>
        );
      });
    }

    if (style === "dotart") {
      return text.split("\n").map((line, i) => {
        if (line.startsWith("  *")) {
          return (
            <span key={i}>
              {"  "}<span style={{ color: theme.info }}>*</span>
              <span style={{ color: theme.fg }}>{line.slice(3)}</span>{"\n"}
            </span>
          );
        }
        if (line.includes(" o ") || line.includes(" v ")) {
          return <span key={i} style={{ color: theme.art }}>{line}{"\n"}</span>;
        }
        if (line.includes("~") && line.includes(data.name)) {
          return <span key={i} style={{ color: theme.accent }} className="font-bold">{line}{"\n"}</span>;
        }
        return <span key={i} style={{ color: theme.fg, opacity: line.match(/^[.\s]+$/) ? 0.4 : 0.7 }}>{line}{"\n"}</span>;
      });
    }

    if (style === "biglogo") {
      return text.split("\n").map((line, i) => {
        if (line.includes("######")) {
          return <span key={i} style={{ color: theme.art }}>{line}{"\n"}</span>;
        }
        if (line.includes(">")) {
          const parts = line.split(">");
          return (
            <span key={i}>
              <span style={{ color: theme.fg, opacity: 0.5 }}>{parts[0]}</span>
              <span style={{ color: theme.info }}>{">"}</span>
              <span style={{ color: theme.fg }}>{parts.slice(1).join(">")}</span>{"\n"}
            </span>
          );
        }
        if (line.includes("###")) {
          return <span key={i}>{line.split(/(###)/).map(colorBlocks)}{"\n"}</span>;
        }
        if (line.includes("===") || line.startsWith("+")) {
          return <span key={i} style={{ color: theme.fg, opacity: 0.4 }}>{line}{"\n"}</span>;
        }
        if (line.includes("---")) {
          return <span key={i} style={{ color: theme.fg, opacity: 0.3 }}>{line}{"\n"}</span>;
        }
        return <span key={i} style={{ color: theme.fg }}>{line}{"\n"}</span>;
      });
    }

    // box style
    return text.split("\n").map((line, i) => {
      if (line.includes("###")) {
        return <span key={i}>{line.split(/(###)/).map(colorBlocks)}{"\n"}</span>;
      }
      if (line.startsWith("+")) {
        return <span key={i} style={{ color: theme.fg, opacity: 0.4 }}>{line}{"\n"}</span>;
      }
      const labelMatch = line.match(/^(\|\s*)(\w+)(: )(.*?)(\s*\|)$/);
      if (labelMatch) {
        return (
          <span key={i}>
            <span style={{ color: theme.fg, opacity: 0.4 }}>{labelMatch[1]}</span>
            <span style={{ color: theme.info }} className="font-bold">{labelMatch[2]}</span>
            <span style={{ color: theme.fg, opacity: 0.5 }}>{labelMatch[3]}</span>
            <span style={{ color: theme.fg }}>{labelMatch[4]}</span>
            <span style={{ color: theme.fg, opacity: 0.4 }}>{labelMatch[5]}</span>
            {"\n"}
          </span>
        );
      }
      // Border chars
      if (line.startsWith("|") && line.endsWith("|")) {
        const inner = line.slice(1, -1);
        return (
          <span key={i}>
            <span style={{ color: theme.fg, opacity: 0.4 }}>|</span>
            <span style={{ color: theme.fg }}>{inner}</span>
            <span style={{ color: theme.fg, opacity: 0.4 }}>|</span>
            {"\n"}
          </span>
        );
      }
      return <span key={i} style={{ color: theme.fg }}>{line}{"\n"}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* Style toggle */}
      <div className="flex gap-2 flex-wrap">
        {STYLES.map((s) => (
          <button
            key={s.key}
            className={`btn-terminal text-xs ${style === s.key ? "btn-terminal-primary" : "btn-terminal-secondary"}`}
            onClick={() => { setStyle(s.key); setTrigger(t => t + 1); }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Color theme picker */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono-terminal text-xs text-muted-foreground">theme:</span>
        {(Object.entries(COLOR_THEMES) as [ColorTheme, typeof theme][]).map(([key, t]) => (
          <button
            key={key}
            onClick={() => { setColorTheme(key); setTrigger(tr => tr + 1); }}
            className={`w-6 h-6 rounded-sm border-2 transition-all ${
              colorTheme === key ? "border-foreground scale-110" : "border-transparent opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: t.fg }}
            title={t.label}
          />
        ))}
      </div>

      {/* Terminal output */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
          <span className="font-mono-terminal text-xs text-muted-foreground ml-2">
            ~/termcard/output
          </span>
        </div>
        <div className="terminal-body overflow-x-auto">
          <div className="text-muted-foreground text-xs mb-3">
            <span style={{ color: theme.accent }}>$</span> termcard --generate --style={style} --theme={colorTheme}
          </div>
          <div ref={cardRef} className="p-4 bg-card rounded-sm min-w-fit">
            <pre className="font-mono-terminal text-[11px] sm:text-xs leading-relaxed whitespace-pre" style={{ textShadow: `0 0 8px ${theme.fg}40` }}>
              {renderColorized(displayed)}
              {!isDone && (
                <span className="cursor-blink" style={{ color: theme.fg }}>_</span>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isDone && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleCopy} className="btn-terminal-secondary flex items-center gap-2 text-xs">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "copied!" : "copy text"}
          </button>
          <button onClick={handleDownloadImage} className="btn-terminal-secondary flex items-center gap-2 text-xs">
            <Download className="w-3.5 h-3.5" />
            save .png
          </button>
          <button onClick={handleReplay} className="btn-terminal-secondary flex items-center gap-2 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            replay
          </button>
        </div>
      )}
    </div>
  );
}
