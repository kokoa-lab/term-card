import { useState } from "react";
import type { CardData } from "@/lib/ascii-card";

interface CardFormProps {
  onGenerate: (data: CardData) => void;
}

export default function CardForm({ onGenerate }: CardFormProps) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [github, setGithub] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onGenerate({ name, title, github, skills, email, website });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
          <span className="font-mono-terminal text-xs text-muted-foreground ml-2">
            ~/termcard/config
          </span>
        </div>
        <div className="terminal-body space-y-3">
          <div>
            <label className="text-xs text-terminal-info-label mb-1 block font-mono-terminal">
              <span className="text-terminal-prompt">$</span> name
            </label>
            <input
              className="input-terminal"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
            />
          </div>
          <div>
            <label className="text-xs text-terminal-info-label mb-1 block font-mono-terminal">
              <span className="text-terminal-prompt">$</span> title
            </label>
            <input
              className="input-terminal"
              placeholder="Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={40}
            />
          </div>
          <div>
            <label className="text-xs text-terminal-info-label mb-1 block font-mono-terminal">
              <span className="text-terminal-prompt">$</span> github
            </label>
            <input
              className="input-terminal"
              placeholder="username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              maxLength={39}
            />
          </div>
          <div>
            <label className="text-xs text-terminal-info-label mb-1 block font-mono-terminal">
              <span className="text-terminal-prompt">$</span> email
            </label>
            <input
              className="input-terminal"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={50}
            />
          </div>
          <div>
            <label className="text-xs text-terminal-info-label mb-1 block font-mono-terminal">
              <span className="text-terminal-prompt">$</span> website
            </label>
            <input
              className="input-terminal"
              placeholder="https://yoursite.dev"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={60}
            />
          </div>
          <div>
            <label className="text-xs text-terminal-info-label mb-1 block font-mono-terminal">
              <span className="text-terminal-prompt">$</span> skills{" "}
              <span className="text-muted-foreground">(쉼표로 구분)</span>
            </label>
            <input
              className="input-terminal"
              placeholder="React, TypeScript, Node.js"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              maxLength={100}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn-terminal-primary w-full">
        {">"} generate --card
      </button>
    </form>
  );
}
