"use client";

import { useState } from "react";
import Icon from "./Icon";

const COMMANDS = {
  local: "git clone https://github.com/werseecloud/GuildCore.git && cd GuildCore && npm install && npm run db:generate && cd dashboard && npm install && npm run dev",
  docker: "docker run -p 3000:3000 -p 8080:8080 ghcr.io/werseecloud/guildcore:latest",
  source: "git clone https://github.com/werseecloud/GuildCore.git",
};

type Tab = keyof typeof COMMANDS;

export default function InstallBanner() {
  const [tab, setTab] = useState<Tab>("local");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMANDS[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="install-banner">
      <div className="install-tabs">
        {(Object.keys(COMMANDS) as Tab[]).map((k) => (
          <button
            key={k}
            className={`install-tab ${tab === k ? "active" : ""}`}
            onClick={() => setTab(k)}
            type="button"
          >
            {k}
          </button>
        ))}
      </div>

      <div className="install-cmd">
        <span className="install-prompt">$</span>
        <code>{COMMANDS[tab]}</code>
        <button className="install-copy" onClick={copy} aria-label="Copy command" type="button">
          <Icon name={copied ? "check2" : "copy"} size={16} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="install-meta">
        <span className="chip success">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
          MIT licensed
        </span>
        <span className="chip">
          <Icon name="server" size={12} /> Runs on localhost
        </span>
        <span className="chip">
          <Icon name="rocket" size={12} /> Live in 60 seconds
        </span>
      </div>
    </div>
  );
}
