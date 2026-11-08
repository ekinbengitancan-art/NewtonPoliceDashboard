"use client";

import React, { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Icon, { type IconName } from "@/components/Icon";
import Logo from "@/components/Logo";

type Guild = { id: string; name: string; icon?: string | null };
type TabKey = "overview" | "personnel" | "modules" | "tickets" | "settings";

const TABS: { key: TabKey; label: string; icon: IconName; badge?: string }[] = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "personnel", label: "Personnel", icon: "users" },
  { key: "modules", label: "Modules", icon: "boxes" },
  { key: "tickets", label: "Tickets", icon: "ticket", badge: "12" },
  { key: "settings", label: "Settings", icon: "cog" },
];


export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [guildsLoaded, setGuildsLoaded] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  async function loadNotifications() {
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.error("Bildirimler yüklenemedi:", error);
    }
  }

  async function markNotificationRead(id: string) {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) return;

    setNotifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }

  async function markAllNotificationsRead() {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true }),
    });

    if (!response.ok) return;

    setNotifications((items) =>
      items.map((item) => ({ ...item, read: true }))
    );
    setUnreadCount(0);
  }
  useEffect(() => {
    if (status !== "authenticated") {
      setGuilds([]);
      setSelectedGuild(null);
      setGuildsLoaded(false);
      return;
    }

    let cancelled = false;

    async function checkAccess() {
      try {
        const response = await fetch("/api/guilds", {
          cache: "no-store",
        });

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !Array.isArray(data)) {
          setGuilds([]);
          setSelectedGuild(null);
        } else {
          setGuilds(data);
          setSelectedGuild(
            data.find(
              (guild: Guild) => guild.id === "1524894549636288604"
            ) ?? null
          );
        }
      } catch {
        if (!cancelled) {
          setGuilds([]);
          setSelectedGuild(null);
        }
      } finally {
        if (!cancelled) setGuildsLoaded(true);
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [status]);

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
        <p>
          Sign in with Discord to manage your server, personnel, modules, and tickets.
        </p>
        <button
          onClick={() => signIn("discord")}
          className="btn-primary gate-button"
          type="button"
        >
          <Icon name="discord" />
          Continue with Discord
        </button>
      </div>
    );
  }

  if (!guildsLoaded) {
    return (
      <div className="loader-wrap">
        <div className="dashboard-skeleton" aria-hidden />
        Checking server permissions...
      </div>
    );
  }

  if (!selectedGuild) {
    return (
      <div className="gate fade-up">
        <Logo size={54} />
        <h1>Access denied.</h1>
        <p>
          You need the Manage Server permission on Newton Police Station
          to access this dashboard.
        </p>
        <button
          onClick={() => signOut()}
          className="btn-primary gate-button"
          type="button"
        >
          Sign out
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
          {guilds.map((guild) => (
            <button
              key={guild.id}
              onClick={() => setSelectedGuild(guild)}
              className={`guild-item ${
                selectedGuild?.id === guild.id ? "active" : ""
              }`}
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
                <div className="guild-icon">
                  {guild.name[0]?.toUpperCase()}
                </div>
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
              className={`sidebar-item ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              <span className="sidebar-item-icon">
                <Icon name={tab.icon} />
              </span>
              <span>{tab.label}</span>
              {tab.badge && <span className="badge">{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          {session.user?.image ? (
            <img src={session.user.image} alt="" />
          ) : (
            <div className="guild-icon">U</div>
          )}
          <div>
            <div className="name">
              {session.user?.name ?? "Discord user"}
            </div>
            <button
              className="signout"
              onClick={() => signOut()}
              type="button"
            >
              Sign out
            </button>
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
            <button
              className={`btn-icon ${
                unreadCount > 0 ? "has-dot" : ""
              }`}
              title="Notifications"
              type="button"
              onClick={() => {
                const next = !notificationsOpen;
                setNotificationsOpen(next);
                if (next) loadNotifications();
              }}
            >
              <Icon name="bell" />
              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {notificationsOpen && (
          <section className="notification-panel">
            <div className="notification-panel-header">
              <div>
                <h3>Notifications</h3>
                <p>{unreadCount} unread notifications</p>
              </div>

              <button
                type="button"
                className="notification-mark-all"
                onClick={markAllNotificationsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`notification-item ${
                      item.read ? "read" : "unread"
                    }`}
                    onClick={() =>
                      !item.read && markNotificationRead(item.id)
                    }
                  >
                    <span className="notification-indicator" />
                    <span className="notification-content">
                      <strong>{item.title}</strong>
                      <span>{item.message}</span>
                      <small>
                        {new Date(item.createdAt).toLocaleString()}
                      </small>
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        )}

        <section className="dash-brand-panel fade-up delay-1">
          <div>
            <span className="chip success">localhost:3000 ready</span>
            <h2>GuildCore identity is active.</h2>
            <p>
              Developed by Wersee Team for the public. This dashboard is branded for
              self-hosted Discord operations: personnel, modules, tickets, and server
              settings in one control surface.
            </p>
          </div>

          <div
            className="dash-brand-meter"
            aria-label="GuildCore local setup status"
          >
            <MiniStatus label="Bot install" value="Ready" />
            <MiniStatus label="Dashboard" value="Localhost" />
            <MiniStatus label="License" value="Open source" />
          </div>
        </section>

        <div key={activeTab} className="fade-up dash-tab-body">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "personnel" && <PersonnelTab />}
          {activeTab === "modules" && <ModulesTab />}
          {activeTab === "tickets" && <TicketsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}



function tabSubtitle(tab: TabKey) {
  switch (tab) {
    case "overview": return "A quick pulse on your server, protection, and staff load.";
    case "personnel": return "Newton Police Department personnel, ranks, assignments, and status.";
    case "modules": return "Toggle GuildCore modules on or off instantly.";
    case "tickets": return "Open conversations, staff routing, and close reasons.";
    case "settings": return "Branding, permissions, language, and public footer copy.";
  }
}

function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/overview", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Veriler alınamadı.");
        }

        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Bir hata oluştu."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = data?.stats;
  const activities = data?.notifications ?? [];
  const modules = data?.modules ?? [];
  const enabledModules = modules.filter((module: any) => module.enabled);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const cards = [
    {
      label: "Total personnel",
      value: stats?.totalPersonnel ?? 0,
      color: "#3B82F6",
    },
    {
      label: "Active personnel",
      value: stats?.activePersonnel ?? 0,
      color: "#2FBF71",
    },
    {
      label: "Open tickets",
      value: stats?.openTickets ?? 0,
      color: "#F4B860",
    },
    {
      label: "Mod actions",
      value: stats?.modActions ?? 0,
      color: "#F26D5B",
    },
  ];

  return (
    <>
      {loading && (
        <div className="activity-card">
          Dashboard verileri yükleniyor...
        </div>
      )}

      {error && (
        <div className="activity-card">
          <p style={{ color: "var(--error)" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="chip"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="stat-grid">
            {cards.map((card) => (
              <article
                className="stat-card"
                key={card.label}
                style={
                  { "--accent-color": card.color } as React.CSSProperties
                }
              >
                <div className="label">
                  <span style={{ background: card.color }} />
                  {card.label}
                </div>

                <div className="value">
                  {Number(card.value).toLocaleString("tr-TR")}
                </div>

                <div className="trend">
                  Veritabanındaki güncel kayıt
                </div>
              </article>
            ))}
          </div>

          <div className="dash-cols">
            <section className="activity-card">
              <div className="activity-head">
                <div>
                  <h3>Recent activity</h3>
                  <p>Sunucudaki son bildirimler.</p>
                </div>

                <span className="chip success">
                  <span className="chip-dot" />
                  Database
                </span>
              </div>

              <div className="activity-list">
                {activities.length > 0 ? (
                  activities.map((activity: any, index: number) => (
                    <ActivityItem
                      key={activity.id}
                      color={
                        [
                          "cool-gradient",
                          "primary-gradient",
                          "warm-gradient",
                          "accent-gradient",
                          "cyan-gradient",
                        ][index % 5]
                      }
                      initials="GC"
                      user={activity.title}
                      action={activity.message}
                      time={formatDate(activity.createdAt)}
                    />
                  ))
                ) : (
                  <p>Henüz kayıtlı bir etkinlik bulunmuyor.</p>
                )}
              </div>
            </section>

            <section className="activity-card health-card">
              <div>
                <h3>Server overview</h3>
                <p>Sunucu veritabanındaki güncel durum.</p>
              </div>

              <div className="bar-stack">
                <Bar
                  label="Closed tickets"
                  value={
                    stats.totalTickets > 0
                      ? Math.round(
                          (stats.closedTickets / stats.totalTickets) * 100
                        )
                      : 0
                  }
                  color="var(--success)"
                />

                <Bar
                  label="Open tickets"
                  value={
                    stats.totalTickets > 0
                      ? Math.round(
                          (stats.openTickets / stats.totalTickets) * 100
                        )
                      : 0
                  }
                  color="var(--primary)"
                />

                <Bar
                  label="Active modules"
                  value={
                    modules.length > 0
                      ? Math.round(
                          (enabledModules.length / modules.length) * 100
                        )
                      : 0
                  }
                  color="var(--secondary)"
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <h3>Enabled modules</h3>
                <p>
                  {enabledModules.length} / {modules.length} modül aktif
                </p>

                <div className="activity-list">
                  {enabledModules.length > 0 ? (
                    enabledModules.map((module: any) => (
                      <div key={module.module} className="activity-item">
                        <div className="activity-avatar primary-gradient">
                          GC
                        </div>
                        <div className="activity-text">
                          <strong>{module.module}</strong>
                          <span>Active</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aktif modül bulunamadı.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </>
      )}
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
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");

  async function loadTickets() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tickets", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ticket kayitlari alinamadi.");
      }

      setTickets(Array.isArray(data) ? data : data.tickets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleAction(ticketId: string, action: "claim" | "close") {
    if (action === "close" && !window.confirm("Bu ticket kapatilsin mi?")) {
      return;
    }

    setPendingId(ticketId);
    setError("");

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Islem gerceklestirilemedi.");
      }

      await loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu.");
    } finally {
      setPendingId("");
    }
  }

  function statusInfo(status: string) {
    switch (status) {
      case "open":
        return { label: "Acik", className: "success" };
      case "claimed":
        return { label: "Ustlenildi", className: "warn" };
      case "closed":
        return { label: "Kapali", className: "" };
      default:
        return { label: status, className: "" };
    }
  }

  return (
    <div className="list-card">
      <div className="row head">
        <div>Ticket</div>
        <div>Kullanici</div>
        <div>Durum</div>
        <div>Islem</div>
      </div>

      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{tickets.length} ticket kaydi</span>
        <button
          className="btn-ghost table-action"
          type="button"
          onClick={loadTickets}
          disabled={loading}
        >
          {loading ? "Yukleniyor..." : "Yenile"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", color: "#ef7777" }}>
          {error}
        </div>
      )}

      {loading && tickets.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center" }}>
          Ticket kayitlari yukleniyor...
        </div>
      ) : tickets.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center" }}>
          Henuz ticket kaydi bulunmuyor.
        </div>
      ) : (
        tickets.map((ticket) => {
          const status = statusInfo(ticket.status);
          const busy = pendingId === ticket.id;

          return (
            <div key={ticket.id} className="row">
              <div>
                <strong>#{ticket.ticketNumber}</strong>
                <span>{ticket.subject || ticket.category || "Destek talebi"}</span>
                {ticket.claimedBy && (
                  <small style={{ display: "block", opacity: 0.7 }}>
                    Ustlenen: {ticket.claimedBy.globalName || ticket.claimedBy.username}
                  </small>
                )}
              </div>

              <div>
                {ticket.user?.globalName || ticket.user?.username || "Bilinmeyen kullanici"}
              </div>

              <div>
                <span className={`chip ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ticket.status !== "closed" ? (
                  <>
                    <button
                      className="btn-ghost table-action"
                      type="button"
                      disabled={busy || ticket.status === "claimed"}
                      onClick={() => handleAction(ticket.id, "claim")}
                    >
                      {busy ? "..." : ticket.status === "claimed" ? "Ustlenildi" : "Ustlen"}
                    </button>

                    <button
                      className="btn-ghost table-action"
                      type="button"
                      disabled={busy}
                      onClick={() => handleAction(ticket.id, "close")}
                    >
                      Kapat
                    </button>

                    <button
                      className="btn-ghost table-action"
                      type="button"
                      onClick={() =>
                        window.open(
                          `https://discord.com/channels/${ticket.guildId}/${ticket.channelId}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Discord'da Ac
                    </button>
                  </>
                ) : (
                  <span style={{ opacity: 0.6 }}>Kanal kapali</span>
                )}
              </div>
            </div>
          );
        })
      )}
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
function PersonnelTab() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rankReason, setRankReason] = useState("");

  const emptyForm = {
    discordId: "",
    badgeNumber: "",
    firstName: "",
    lastName: "",
    callsign: "",
    rank: "Officer",
    division: "Patrol",
    status: "active",
    hireDate: new Date().toISOString().slice(0, 10),
    notes: "",
    photoUrl: "",
  };

  const [form, setForm] = useState<any>(emptyForm);

  const loadPersonnel = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/personnel", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Personel listesi alınamadı.");
      setPersonnel(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonnel();
  }, []);

  const updateField = (key: string, value: string) => {
    setForm((previous: any) => ({ ...previous, [key]: value }));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, hireDate: new Date().toISOString().slice(0, 10) });
    setRankReason("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEdit = (person: any) => {
    setEditing(person);
    setForm({
      discordId: person.discordId || "",
      badgeNumber: person.badgeNumber || "",
      firstName: person.firstName || "",
      lastName: person.lastName || "",
      callsign: person.callsign || "",
      rank: person.rank || "Officer",
      division: person.division || "Patrol",
      status: person.status || "active",
      hireDate: person.hireDate
        ? new Date(person.hireDate).toISOString().slice(0, 10)
        : "",
      notes: person.notes || "",
      photoUrl: person.photoUrl || "",
    });
    setRankReason("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const savePersonnel = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: any = {
        ...form,
        hireDate: form.hireDate
          ? new Date(form.hireDate + "T12:00:00").toISOString()
          : undefined,
      };

      if (editing) {
        payload.id = editing.id;
        if (form.rank !== editing.rank) {
          payload.reason = rankReason.trim();
        }
      }

      const res = await fetch("/api/personnel", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Personel kaydedilemedi.");

      setModalOpen(false);
      setSuccess(editing ? "Personel bilgileri güncellendi." : "Yeni personel kaydedildi.");
      await loadPersonnel();
    } catch (err: any) {
      setError(err.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const deletePersonnel = async (person: any) => {
    const confirmed = window.confirm(
      `${person.firstName} ${person.lastName} adlı personeli silmek istediğine emin misin? Bu işlem geri alınamaz.`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/personnel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: person.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Personel silinemedi.");

      setSuccess("Personel kaydı silindi.");
      await loadPersonnel();
    } catch (err: any) {
      setError(err.message || "Silme işlemi başarısız.");
    }
  };

  const uploadPhoto = async (file?: File) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Yalnızca JPG, PNG veya WEBP formatında fotoğraf yükleyebilirsin.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Fotoğraf boyutu en fazla 5 MB olabilir.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/personnel/photo", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fotoğraf yüklenemedi.");

      updateField("photoUrl", data.photoUrl);
      setSuccess("Fotoğraf yüklendi.");
    } catch (err: any) {
      setError(err.message || "Fotoğraf yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const filteredPersonnel = useMemo(() => {
    return personnel.filter((person) => {
      const query = search.toLowerCase();
      const matchesSearch = [
        person.firstName,
        person.lastName,
        person.badgeNumber,
        person.discordId,
        person.callsign,
        person.rank,
        person.division,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && person.status === "active") ||
        (filter === "inactive" && person.status !== "active");

      return matchesSearch && matchesFilter;
    });
  }, [personnel, search, filter]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 9,
    border: "1px solid var(--border, #303744)",
    background: "var(--background, #111827)",
    color: "inherit",
    outline: "none",
    fontSize: 13,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 7,
    opacity: 0.8,
  };

  const buttonStyle: React.CSSProperties = {
    border: "1px solid var(--border, #303744)",
    borderRadius: 9,
    padding: "9px 13px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    background: "var(--background, #111827)",
    color: "inherit",
  };

  const activeCount = personnel.filter((p) => p.status === "active").length;

  return (
    <section className="activity-card" style={{ padding: 22 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
        marginBottom: 22,
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 19 }}>Newton Police Department Personnel</h3>
          <p style={{ margin: "6px 0 0", opacity: 0.65, fontSize: 13 }}>
            Personel kayıtlarını, rütbeleri ve birimleri buradan yönetebilirsin.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          style={{
            ...buttonStyle,
            background: "var(--primary, #2563eb)",
            borderColor: "var(--primary, #2563eb)",
            color: "#fff",
            padding: "11px 17px",
          }}
        >
          + Personel Ekle
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
        marginBottom: 20,
      }}>
        {[
          { label: "Toplam Personel", value: personnel.length },
          { label: "Aktif Personel", value: activeCount },
          { label: "Pasif Personel", value: personnel.length - activeCount },
        ].map((item) => (
          <div key={item.label} style={{
            padding: 15,
            borderRadius: 11,
            border: "1px solid var(--border, #303744)",
            background: "var(--background, #111827)",
          }}>
            <div style={{ fontSize: 12, opacity: 0.65 }}>{item.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 5 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          padding: 12,
          borderRadius: 9,
          background: "rgba(220,38,38,.12)",
          color: "#ef7777",
          marginBottom: 14,
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: 12,
          borderRadius: 9,
          background: "rgba(22,163,74,.12)",
          color: "#4ade80",
          marginBottom: 14,
          fontSize: 13,
        }}>
          {success}
        </div>
      )}

      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 18,
      }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim, sicil, Discord ID, rütbe veya birim ara..."
          style={{ ...inputStyle, flex: "1 1 240px" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", minWidth: 150 }}
        >
          <option value="all">Tüm Personel</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
        <button type="button" onClick={loadPersonnel} style={buttonStyle}>
          Listeyi Yenile
        </button>
      </div>

      {loading ? (
        <p style={{ padding: 20, textAlign: "center", opacity: 0.7 }}>
          Personel listesi yükleniyor...
        </p>
      ) : filteredPersonnel.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", opacity: 0.65 }}>
          {personnel.length === 0
            ? "Henüz personel kaydı bulunmuyor. İlk personeli ekleyebilirsin."
            : "Aramana uygun personel bulunamadı."}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filteredPersonnel.map((person) => (
            <div
              key={person.id}
              className="activity-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: 13,
                border: "1px solid var(--border, #303744)",
                borderRadius: 11,
                flexWrap: "wrap",
              }}
            >
              {person.photoUrl ? (
                <img
                  src={person.photoUrl}
                  alt={`${person.firstName} ${person.lastName}`}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div className="activity-avatar primary-gradient">
                  {person.firstName?.[0] ?? "P"}
                </div>
              )}

              <div className="activity-text" style={{ flex: "1 1 180px" }}>
                <strong>{person.firstName} {person.lastName}</strong>
                <span>
                  {person.rank} · {person.division || "Atanmamış"}
                </span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>
                  Sicil: {person.badgeNumber || "—"}
                  {person.callsign ? ` · Çağrı kodu: ${person.callsign}` : ""}
                </span>
              </div>

              <span style={{
                fontSize: 11,
                padding: "5px 9px",
                borderRadius: 20,
                background: person.status === "active"
                  ? "rgba(22,163,74,.14)"
                  : "rgba(148,163,184,.14)",
                color: person.status === "active" ? "#4ade80" : "#94a3b8",
              }}>
                {person.status === "active" ? "Aktif" : person.status}
              </span>

              <div style={{ display: "flex", gap: 7 }}>
                <button type="button" onClick={() => openEdit(person)} style={buttonStyle}>
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => deletePersonnel(person)}
                  style={{ ...buttonStyle, color: "#f87171" }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving && !uploading) {
              setModalOpen(false);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            overflowY: "auto",
          }}
        >
          <div style={{
            width: "100%",
            maxWidth: 680,
            maxHeight: "92vh",
            overflowY: "auto",
            borderRadius: 15,
            padding: 23,
            background: "var(--card, #171e2b)",
            border: "1px solid var(--border, #303744)",
            boxShadow: "0 20px 70px rgba(0,0,0,.4)",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 19 }}>
                  {editing ? "Personel Bilgilerini Düzenle" : "Yeni Personel Kaydı"}
                </h3>
                <p style={{ margin: "5px 0 0", fontSize: 12, opacity: 0.6 }}>
                  Gerekli personel bilgilerini doldur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving || uploading}
                style={buttonStyle}
              >
                ✕
              </button>
            </div>

            <form onSubmit={savePersonnel}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Personel Fotoğrafı</label>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {form.photoUrl ? (
                    <img
                      src={form.photoUrl}
                      alt="Personel fotoğrafı"
                      style={{
                        width: 66,
                        height: 66,
                        borderRadius: 12,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="activity-avatar primary-gradient" style={{
                      width: 66,
                      height: 66,
                      fontSize: 22,
                    }}>
                      {form.firstName?.[0] || "P"}
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading}
                      onChange={(e) => uploadPhoto(e.target.files?.[0])}
                      style={{ fontSize: 12, maxWidth: "100%" }}
                    />
                    <p style={{ fontSize: 11, opacity: 0.55, marginBottom: 0 }}>
                      JPG, PNG veya WEBP · Maksimum 5 MB
                    </p>
                    {uploading && <span style={{ fontSize: 12 }}>Fotoğraf yükleniyor...</span>}
                  </div>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}>
                {[
                  { key: "firstName", label: "Ad", required: true },
                  { key: "lastName", label: "Soyad", required: true },
                  { key: "discordId", label: "Discord Kullanıcı ID", required: true },
                  { key: "badgeNumber", label: "Sicil Numarası", required: true },
                  { key: "callsign", label: "Çağrı Kodu", required: false },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}{field.required ? " *" : ""}</label>
                    <input
                      required={field.required}
                      value={form[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      style={inputStyle}
                      placeholder={field.label}
                    />
                  </div>
                ))}

                <div>
                  <label style={labelStyle}>Rütbe</label>
                  <select
                    value={form.rank}
                    onChange={(e) => updateField("rank", e.target.value)}
                    style={inputStyle}
                  >
                    {[
                      "Cadet", "Officer", "Senior Officer", "Corporal",
                      "Sergeant", "Lieutenant", "Captain", "Commander",
                      "Deputy Chief", "Chief of Police",
                    ].map((rank) => <option key={rank} value={rank}>{rank}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Birim</label>
                  <select
                    value={form.division}
                    onChange={(e) => updateField("division", e.target.value)}
                    style={inputStyle}
                  >
                    {[
                      "Patrol", "Traffic Division", "Metropolitan Division",
                      "Detective Bureau", "AIR", "FTO", "Internal Affairs",
                      "SWAT", "Administration",
                    ].map((division) => (
                      <option key={division} value={division}>{division}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Durum</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                    <option value="suspended">Uzaklaştırıldı</option>
                    <option value="leave">İzinli</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Göreve Başlama Tarihi</label>
                  <input
                    type="date"
                    value={form.hireDate}
                    onChange={(e) => updateField("hireDate", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginTop: 15 }}>
                <label style={labelStyle}>Personel Notları</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="Personel hakkında ek bilgiler..."
                />
              </div>

              {editing && form.rank !== editing.rank && (
                <div style={{ marginTop: 15 }}>
                  <label style={labelStyle}>Rütbe Değişikliği Gerekçesi</label>
                  <textarea
                    value={rankReason}
                    onChange={(e) => setRankReason(e.target.value)}
                    rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Rütbe değişikliğinin nedeni..."
                  />
                </div>
              )}

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 9,
                marginTop: 22,
              }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving || uploading}
                  style={buttonStyle}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  style={{
                    ...buttonStyle,
                    background: "var(--primary, #2563eb)",
                    borderColor: "var(--primary, #2563eb)",
                    color: "#fff",
                    minWidth: 125,
                  }}
                >
                  {saving ? "Kaydediliyor..." : editing ? "Değişiklikleri Kaydet" : "Personeli Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}




