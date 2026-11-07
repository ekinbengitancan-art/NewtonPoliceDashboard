"use client";

import React, { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Icon, { type IconName } from "@/components/Icon";
import Logo from "@/components/Logo";

type Guild = { id: string; name: string; icon?: string | null };
type TabKey = "overview" | "modules" | "moderation" | "tickets" | "marketplace" | "settings";

const TABS: { key: TabKey; label: string; icon: IconName; badge?: string }[] = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "modules", label: "Modules", icon: "boxes" },
  { key: "moderation", label: "Moderation", icon: "shield", badge: "3" },
  { key: "tickets", label: "Tickets", icon: "ticket", badge: "12" },
  { key: "marketplace", label: "Marketplace", icon: "store" },
  { key: "settings", label: "Settings", icon: "cog" },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/guilds")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGuilds(data);
          setSelectedGuild(data[0] ?? null);
        } else {
          setGuilds([]);
        }
      })
      .catch(() => setGuilds([]));
  }, [session]);

  if (status === "loading") {
    return (
      <div className="loader-wrap">
        <div className="dashboard-skeleton" aria-hidden />
        Loading your dashboard...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="gate fade-up">
        <Logo size={54} />
        <h1>Welcome back.</h1>
        <p>Sign in with Discord to manage GuildCore modules, servers, tickets, and marketplace settings.</p>
        <button onClick={() => signIn("discord")} className="btn-primary gate-button" type="button">
          <Icon name="discord" />
          Continue with Discord
        </button>
      </div>
    );
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar fade-in">
        <div className="dash-sidebar-brand">
          <Logo size={36} />
          <span>Public build</span>
        </div>

        <div className="sidebar-section-label">Servers</div>
        <div className="guild-list">
          {guilds.length === 0 && (
            <div className="guild-item empty">
              <div className="guild-icon">GC</div>
              <span>No servers yet</span>
            </div>
          )}
          {guilds.map((guild) => (
            <button
              key={guild.id}
              onClick={() => setSelectedGuild(guild)}
              className={`guild-item ${selectedGuild?.id === guild.id ? "active" : ""}`}
              type="button"
            >
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  width={28}
                  height={28}
                  alt=""
                />
              ) : (
                <div className="guild-icon">{guild.name[0]?.toUpperCase()}</div>
              )}
              <span>{guild.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Manage</div>
        <nav className="sidebar-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`sidebar-item ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              <span className="sidebar-item-icon"><Icon name={tab.icon} /></span>
              <span>{tab.label}</span>
              {tab.badge && <span className="badge">{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          {session.user?.image ? <img src={session.user.image} alt="" /> : <div className="guild-icon">U</div>}
          <div>
            <div className="name">{session.user?.name ?? "Discord user"}</div>
            <button className="signout" onClick={() => signOut()} type="button">Sign out</button>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header fade-up">
          <div>
            <span className="dash-kicker">GuildCore dashboard</span>
            <h1>
              {TABS.find((tab) => tab.key === activeTab)?.label}
              {selectedGuild && <span>{selectedGuild.name}</span>}
            </h1>
            <p>{tabSubtitle(activeTab)}</p>
          </div>
          <div className="dash-header-actions">
            <button className="btn-icon" title="Search" type="button"><Icon name="search" /></button>
            <button className="btn-icon has-dot" title="Notifications" type="button"><Icon name="bell" /></button>
            <button className="btn-primary dash-save" type="button">
              <Icon name="check" />
              Save changes
            </button>
          </div>
        </header>

        <section className="dash-brand-panel fade-up delay-1">
          <div>
            <span className="chip success">localhost:3000 ready</span>
            <h2>GuildCore identity is active.</h2>
            <p>
              Developed by Wersee Team for the public. This dashboard is branded for
              self-hosted Discord operations: modules, moderation, tickets, marketplace,
              and settings in one local control surface.
            </p>
          </div>
          <div className="dash-brand-meter" aria-label="GuildCore local setup status">
            <MiniStatus label="Bot install" value="Ready" />
            <MiniStatus label="Dashboard" value="Localhost" />
            <MiniStatus label="License" value="Open source" />
          </div>
        </section>

        <div key={activeTab} className="fade-up dash-tab-body">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "modules" && <ModulesTab />}
          {activeTab === "moderation" && <ModerationTab />}
          {activeTab === "tickets" && <TicketsTab />}
          {activeTab === "marketplace" && <MarketplaceTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

function tabSubtitle(tab: TabKey) {
  switch (tab) {
    case "overview": return "A quick pulse on your server, protection, and staff load.";
    case "modules": return "Toggle GuildCore modules on or off instantly.";
    case "moderation": return "Auto-mod, anti-raid, audit actions, and verification rules.";
    case "tickets": return "Open conversations, staff routing, and close reasons.";
    case "marketplace": return "Listings, seller checks, payouts, and order controls.";
    case "settings": return "Branding, permissions, language, and public footer copy.";
  }
}

function OverviewTab() {
  return (
    <>
      <div className="stat-grid">
        <StatCard label="Total members" value="12,482" trend="+124 today" trendColor="var(--success)" sparkColor="#3B82F6" data={[2, 4, 3, 5, 6, 5, 7, 8, 7, 9]} />
        <StatCard label="Active users" value="2,103" trend="15% vs last week" trendColor="var(--success)" sparkColor="#2FBF71" data={[5, 4, 6, 8, 7, 9, 8, 9, 10, 11]} />
        <StatCard label="Tickets resolved" value="156" trend="98% satisfaction" trendColor="var(--secondary)" sparkColor="#F4B860" data={[3, 5, 4, 6, 5, 7, 6, 8, 7, 9]} />
        <StatCard label="Mod actions" value="42" trend="3 raids prevented" trendColor="var(--error)" sparkColor="#F26D5B" data={[1, 2, 1, 3, 2, 4, 3, 5, 4, 6]} />
      </div>

      <div className="dash-cols">
        <section className="activity-card">
          <div className="activity-head">
            <div>
              <h3>Live activity</h3>
              <p>The latest GuildCore events across your server.</p>
            </div>
            <span className="chip success"><span className="chip-dot" />Streaming</span>
          </div>

          <div className="activity-list">
            <ActivityItem color="cool-gradient" initials="LU" user="lukas#3401" action="joined the server" time="2m ago" />
            <ActivityItem color="primary-gradient" initials="ST" user="staff_jay" action="resolved ticket #142" time="15m ago" />
            <ActivityItem color="warm-gradient" initials="GC" user="GuildCore" action="blocked scam link from DiscordSpam#9999" time="42m ago" />
            <ActivityItem color="accent-gradient" initials="MK" user="maaike#0009" action="bought Premium Member from the marketplace" time="1h ago" />
            <ActivityItem color="cyan-gradient" initials="NX" user="nex#1010" action="upgraded role to Moderator" time="2h ago" />
          </div>
        </section>

        <section className="activity-card health-card">
          <div>
            <h3>Server health</h3>
            <p>Protection score and active rule coverage.</p>
          </div>
          <ScoreRing value={94} />
          <div className="bar-stack">
            <Bar label="Anti-spam" value={96} color="var(--success)" />
            <Bar label="Anti-raid" value={88} color="var(--primary)" />
            <Bar label="AI review" value={72} color="var(--secondary)" />
          </div>
        </section>
      </div>
    </>
  );
}

function ModulesTab() {
  const initial: {
    name: string;
    desc: string;
    enabled: boolean;
    iconClass: string;
    icon: IconName;
  }[] = [
    { name: "Moderation", desc: "Warn, kick, ban, and mod logs.", enabled: true, iconClass: "warm-gradient", icon: "shield" },
    { name: "Auto-Mod", desc: "Anti-spam, anti-scam, and word filters.", enabled: true, iconClass: "primary-gradient", icon: "bolt" },
    { name: "Ticket System", desc: "Professional support channel management.", enabled: true, iconClass: "cyan-gradient", icon: "ticket" },
    { name: "Marketplace", desc: "Sell products and services inside Discord.", enabled: false, iconClass: "accent-gradient", icon: "store" },
    { name: "Economy", desc: "Custom currency and shop controls.", enabled: false, iconClass: "cool-gradient", icon: "wallet" },
    { name: "Leveling", desc: "Reward active members with XP and roles.", enabled: true, iconClass: "primary-gradient", icon: "star" },
    { name: "Giveaways", desc: "Host drops with role requirements.", enabled: true, iconClass: "warm-gradient", icon: "gift" },
    { name: "Verification", desc: "Captcha and button verification system.", enabled: true, iconClass: "cyan-gradient", icon: "check2" },
    { name: "AI Helper", desc: "Auto-answers, summaries, and risk analysis.", enabled: false, iconClass: "cool-gradient", icon: "brain" },
  ];

  const [list, setList] = useState(initial);
  const toggle = (index: number) =>
    setList((prev) => prev.map((module, current) => (current === index ? { ...module, enabled: !module.enabled } : module)));

  return (
    <div className="module-grid">
      {list.map((module, index) => (
        <article key={module.name} className="module-card fade-up" style={{ animationDelay: `${index * 40}ms` }}>
          <div className="module-card-head">
            <div className="module-title-wrap">
              <div className={`module-icon ${module.iconClass}`}><Icon name={module.icon} size={18} /></div>
              <div>
                <h4>{module.name}</h4>
                <span className={`chip ${module.enabled ? "success" : ""}`}>
                  {module.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <button className={`toggle ${module.enabled ? "on" : ""}`} onClick={() => toggle(index)} aria-label={`Toggle ${module.name}`} type="button" />
          </div>
          <p>{module.desc}</p>
        </article>
      ))}
    </div>
  );
}

function ModerationTab() {
  const [auto, setAuto] = useState(true);
  const [raid, setRaid] = useState(true);
  const [verify, setVerify] = useState(false);

  return (
    <div className="dash-cols">
      <section className="activity-card form-card">
        <h3>Auto-mod rules</h3>
        <ToggleRow label="Anti-spam" desc="Throttle repeated messages." value={auto} onChange={setAuto} />
        <ToggleRow label="Anti-raid" desc="Slow mode on suspicious join spikes." value={raid} onChange={setRaid} />
        <ToggleRow label="Email verification" desc="Require verified email on join." value={verify} onChange={setVerify} />

        <div>
          <label className="label">Forbidden words</label>
          <input className="input" defaultValue="scam, free nitro, click here" />
        </div>

        <div>
          <label className="label">Mute duration after auto-warn</label>
          <select className="select" defaultValue="15 minutes">
            <option>5 minutes</option>
            <option>15 minutes</option>
            <option>1 hour</option>
            <option>1 day</option>
          </select>
        </div>
      </section>

      <section className="activity-card">
        <h3>Recent actions</h3>
        <div className="activity-list">
          <ActivityItem color="warm-gradient" initials="GC" user="GuildCore" action="banned ScammerX#4421" time="3m" />
          <ActivityItem color="warm-gradient" initials="GC" user="GuildCore" action="muted noisyBot#1100 for 10m" time="22m" />
          <ActivityItem color="primary-gradient" initials="MJ" user="modjay" action="warned User#9981" time="1h" />
          <ActivityItem color="warm-gradient" initials="GC" user="GuildCore" action="auto-deleted scam link" time="2h" />
        </div>
      </section>
    </div>
  );
}

function TicketsTab() {
  const tickets = [
    { id: "#142", subject: "Premium upgrade payment stuck", user: "ana#0123", status: "open", statusClass: "success" },
    { id: "#141", subject: "Cannot access trader role", user: "maxx#9912", status: "waiting", statusClass: "warn" },
    { id: "#140", subject: "Refund request marketplace", user: "kim#5530", status: "open", statusClass: "success" },
    { id: "#139", subject: "Emoji role not assigned", user: "ravi#8800", status: "closed", statusClass: "" },
    { id: "#138", subject: "Verification not working", user: "lina#0042", status: "open", statusClass: "success" },
  ];

  return (
    <div className="list-card">
      <div className="row head">
        <div>Ticket</div>
        <div>User</div>
        <div>Status</div>
        <div>Action</div>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="row">
          <div>
            <strong>{ticket.id}</strong>
            <span>{ticket.subject}</span>
          </div>
          <div>{ticket.user}</div>
          <div><span className={`chip ${ticket.statusClass}`}>{ticket.status}</span></div>
          <div><button className="btn-ghost table-action" type="button">Open</button></div>
        </div>
      ))}
    </div>
  );
}

function MarketplaceTab() {
  const items = [
    { name: "Premium Member", price: "EUR 4.99", sales: 142, color: "primary-gradient" },
    { name: "VIP Lounge Pass", price: "EUR 9.99", sales: 86, color: "accent-gradient" },
    { name: "Custom Role", price: "EUR 2.99", sales: 244, color: "cool-gradient" },
    { name: "Hall of Fame", price: "EUR 19.99", sales: 21, color: "warm-gradient" },
    { name: "Booster Skin", price: "EUR 1.99", sales: 480, color: "cyan-gradient" },
    { name: "Early Access", price: "EUR 14.99", sales: 39, color: "primary-gradient" },
  ];

  return (
    <div className="module-grid">
      {items.map((item, index) => (
        <article key={item.name} className="module-card marketplace-card fade-up" style={{ animationDelay: `${index * 40}ms` }}>
          <div className={`module-icon ${item.color}`}><Icon name="store" size={18} /></div>
          <h4>{item.name}</h4>
          <div className="marketplace-row">
            <strong>{item.price}</strong>
            <span className="chip success">{item.sales} sold</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function SettingsTab() {
  return (
    <section className="activity-card settings-card">
      <h3>GuildCore branding and theme</h3>
      <p>These options control how GuildCore appears in Discord and inside the dashboard.</p>

      <div className="settings-stack">
        <div>
          <label className="label">Primary embed color</label>
          <div className="color-row">
            <input className="color-input" type="color" defaultValue="#3B82F6" />
            <input className="input color-text" defaultValue="#3B82F6" />
          </div>
        </div>
        <div>
          <label className="label">Footer text</label>
          <input className="input" defaultValue="Developed by Wersee Team for the public" />
        </div>
        <div>
          <label className="label">Bot language</label>
          <select className="select" defaultValue="English">
            <option>English</option>
            <option>Dutch</option>
            <option>German</option>
            <option>French</option>
          </select>
        </div>
        <div>
          <label className="label">Welcome message</label>
          <textarea className="input textarea" rows={3} defaultValue="Welcome to {server}. Read the rules, verify, and open a ticket if you need staff." />
        </div>
      </div>
    </section>
  );
}

function MiniStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-status">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendColor,
  sparkColor,
  data,
}: {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  sparkColor: string;
  data: number[];
}) {
  const path = useMemo(() => sparkPath(data, 100, 32), [data]);
  return (
    <article className="stat-card" style={{ "--accent-color": sparkColor } as React.CSSProperties}>
      <div className="label">
        <span style={{ background: sparkColor }} />
        {label}
      </div>
      <div className="value">{value}</div>
      <div className="trend" style={{ color: trendColor }}>
        <Icon name="trendUp" size={12} />
        {trend}
      </div>
      <svg className="sparkline" width="100" height="34" viewBox="0 0 100 34" aria-hidden>
        <path d={path} fill="none" stroke={sparkColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </article>
  );
}

function sparkPath(data: number[], width: number, height: number) {
  if (data.length === 0) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  return data
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function ActivityItem({
  user,
  action,
  time,
  initials,
  color,
}: {
  user: string;
  action: string;
  time: string;
  initials: string;
  color: string;
}) {
  return (
    <div className="activity-item">
      <div className={`activity-avatar ${color}`}>{initials}</div>
      <div className="activity-text">
        <strong>{user}</strong>
        <span>{action}</span>
      </div>
      <div className="activity-time">{time}</div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="score-wrap">
      <svg className="score-ring" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DDC86" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border-strong)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="74" textAnchor="middle" fontFamily="Outfit" fontWeight="800" fontSize="26" fill="currentColor">
          {value}%
        </text>
        <text x="70" y="92" textAnchor="middle" fontSize="9" fill="var(--foreground-dim)">SAFETY</text>
      </svg>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bar-row">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="bar-track">
        <div style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{label}</strong>
        <span>{desc}</span>
      </div>
      <button className={`toggle ${value ? "on" : ""}`} onClick={() => onChange(!value)} aria-label={`Toggle ${label}`} type="button" />
    </div>
  );
}
