import Link from "next/link";
import AnimatedCounter from "@/components/AnimatedCounter";
import DashboardPreview from "@/components/DashboardPreview";
import FAQ from "@/components/FAQ";
import FeatureCard from "@/components/FeatureCard";
import Icon, { type IconName } from "@/components/Icon";
import InstallBanner from "@/components/InstallBanner";
import Logo from "@/components/Logo";

const features: {
  iconName: IconName;
  title: string;
  desc: string;
  iconClass: string;
}[] = [
  {
    iconName: "shield",
    title: "Shield Core",
    desc: "Anti-raid, scam-link detection, verification gates, and audit trails tuned for Discord communities.",
    iconClass: "primary-gradient",
  },
  {
    iconName: "ticket",
    title: "Support Desk",
    desc: "Private ticket channels, transcripts, staff routing, close reasons, and response-time reporting.",
    iconClass: "cyan-gradient",
  },
  {
    iconName: "store",
    title: "Market Hub",
    desc: "Sell roles, perks, services, and digital products with seller checks and clean order history.",
    iconClass: "accent-gradient",
  },
  {
    iconName: "chart",
    title: "Pulse Analytics",
    desc: "Track joins, churn, staff actions, ticket volume, warnings, and module health in one dashboard.",
    iconClass: "warm-gradient",
  },
  {
    iconName: "bolt",
    title: "Flow Automation",
    desc: "Build simple if-this-then-that flows for welcome routes, role sync, moderation, and alerts.",
    iconClass: "cool-gradient",
  },
  {
    iconName: "code",
    title: "Open Module API",
    desc: "Drop in TypeScript modules, ship your own settings panel, and keep full control of the code.",
    iconClass: "primary-gradient",
  },
];

const modules = [
  "Moderation",
  "Auto-Mod",
  "Tickets",
  "Verification",
  "Welcome",
  "Logging",
  "Marketplace",
  "Giveaways",
  "Auto-Roles",
  "Setup Wizard",
  "Analytics",
  "Custom Commands",
  "Anti-Phish",
  "Staff Notes",
  "Role Sync",
  "Webhooks",
  "Schedules",
  "Audit Replay",
];

const testimonials = [
  {
    quote:
      "GuildCore replaced our moderation stack, ticket bot, and marketplace scripts without making staff relearn everything.",
    author: "Nora V.",
    role: "Owner, 41k member creator server",
  },
  {
    quote:
      "The localhost dashboard made testing painless. We cloned it, added our token, and had settings live the same afternoon.",
    author: "Mika R.",
    role: "Community engineer",
  },
  {
    quote:
      "Open source matters to us. We can audit every permission, tune the modules, and still keep a polished dashboard.",
    author: "Ilias K.",
    role: "Gaming network maintainer",
  },
  {
    quote:
      "The Wersee Team kept the product practical. It feels built for staff who need to move fast, not for a marketing demo.",
    author: "Ava S.",
    role: "Head moderator",
  },
];

const faq = [
  {
    q: "Is GuildCore open source?",
    a: "Yes. GuildCore is built as an open-source Discord bot and dashboard by Wersee Team for the public. You can self-host it, fork it, audit it, and build your own modules.",
  },
  {
    q: "What does the one-line installer do?",
    a: "It clones the bot, installs dependencies, prepares Prisma, and starts the dashboard locally. After adding your Discord token and environment values, the dashboard runs on http://localhost:3000.",
  },
  {
    q: "Can I run the bot on my own PC?",
    a: "Yes. The bot, database layer, and dashboard are designed for a local development setup first. For 24/7 uptime, move the same setup to a VPS or Docker host.",
  },
  {
    q: "What is different between self-host and cloud?",
    a: "Self-host gives you full control over code, data, and cost. Cloud is for teams that want managed uptime, backups, and scaling without server maintenance.",
  },
  {
    q: "Can I customize the dashboard branding?",
    a: "Yes. The dashboard includes GuildCore identity by default, and the settings area exposes brand color, footer text, language, and welcome message controls.",
  },
  {
    q: "Does it support large servers?",
    a: "The architecture is modular and ready for sharding, rate-limit aware workers, and separate dashboard hosting. Start locally, then split services when your server grows.",
  },
];

const workflow = [
  {
    n: "01",
    iconName: "terminal" as const,
    title: "Install locally",
    desc: "Run one terminal line to install the bot, dependencies, Prisma client, and dashboard workspace on your PC.",
  },
  {
    n: "02",
    iconName: "cog" as const,
    title: "Connect Discord",
    desc: "Add your bot token, client ID, client secret, and guild settings in the environment files.",
  },
  {
    n: "03",
    iconName: "globe" as const,
    title: "Open localhost",
    desc: "Start the dashboard and manage modules from http://localhost:3000 while your bot runs locally.",
  },
  {
    n: "04",
    iconName: "rocket" as const,
    title: "Move to production",
    desc: "When you are ready, deploy the same repo to your VPS, Docker host, or managed cloud setup.",
  },
];

export default function Home() {
  return (
    <main className="site-main">
      <section className="hero hero-long">
        <div className="hero-copy fade-up">
          <span className="hero-eyebrow">
            <span className="status-dot" />
            <Icon name="sparkles" size={13} />
            GuildCore v3 public build
          </span>

          <h1 className="hero-title">
            Open-source Discord infrastructure for serious communities.
          </h1>

          <p className="hero-subtitle">
            GuildCore is the all-in-one bot and dashboard for moderation, support,
            marketplace tools, automation, analytics, and local self-hosting. Built
            by Wersee Team for the public, with a localhost dashboard you can run on
            your own PC.
          </p>

          <div className="hero-command" aria-label="One-line installer">
            <span>Install full stack locally</span>
            <code>
              git clone https://github.com/werseecloud/GuildCore.git && cd GuildCore && npm install && npm run db:generate && cd dashboard && npm install && npm run dev
            </code>
          </div>

          <div className="hero-cta">
            <Link href="/dashboard" className="btn-primary">
              <Icon name="grid" size={15} />
              Open dashboard
            </Link>
            <a href="#install" className="btn-outline">
              <Icon name="terminal" size={16} />
              Self-host setup
            </a>
            <a
              href="https://github.com/werseecloud/GuildCore"
              className="btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={16} />
              View source
            </a>
          </div>

          <div className="hero-proof" aria-label="GuildCore highlights">
            <span>MIT open source</span>
            <span>Localhost dashboard</span>
            <span>Modular TypeScript bot</span>
            <span>Developed by Wersee Team</span>
          </div>
        </div>

        <div className="hero-preview fade-up delay-2">
          <DashboardPreview />
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="stats-grid">
            <StatCell value={18} suffix="+" label="Core modules" />
            <StatCell value={4} suffix=" min" label="Local setup target" />
            <StatCell value={3000} prefix=":" label="Dashboard port" />
            <StatCell value={100} suffix="%" label="Source available" />
          </div>
        </div>
      </section>

      <section id="install" className="section install-section">
        <div className="container">
          <div className="install-wrap">
            <div className="section-copy fade-up">
              <span className="section-eyebrow">Self-host first</span>
              <h2 className="section-title">
                One line gets the full project onto your PC.
              </h2>
              <p className="section-subtitle left">
                The repo contains the Discord bot, Prisma database layer, and Next.js
                dashboard. Install it locally, add your environment values, and open
                the dashboard on localhost.
              </p>
              <ul className="checklist">
                <li><Icon name="check2" size={14} /> Installs bot and dashboard dependencies</li>
                <li><Icon name="check2" size={14} /> Generates Prisma client for the local database</li>
                <li><Icon name="check2" size={14} /> Starts the dashboard on http://localhost:3000</li>
                <li><Icon name="check2" size={14} /> Keeps the code editable, auditable, and yours</li>
              </ul>
            </div>

            <div className="fade-up delay-2">
              <InstallBanner />
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title">From clone to controlled server.</h2>
            <p className="section-subtitle">
              GuildCore keeps the setup boring and the dashboard useful: install,
              connect Discord, configure modules, then deploy when you are ready.
            </p>
          </div>

          <div className="steps-grid">
            {workflow.map((step) => (
              <Step key={step.n} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <div className="compare-layout">
            <div className="section-copy">
              <span className="section-eyebrow">Self-host vs cloud</span>
              <h2 className="section-title">Choose control, convenience, or both.</h2>
              <p className="section-subtitle left">
                Start with self-hosting on your machine. If the server becomes
                business-critical, move the same stack to a managed host or cloud
                environment without rebuilding your community tools.
              </p>
            </div>

            <div className="compare-grid">
              <CompareCard
                iconName="server"
                title="Self-host"
                desc="Best for builders, open-source communities, homelabs, and teams that want full data control."
                items={[
                  "Free to run on your own hardware",
                  "Full access to source code and database",
                  "Local dashboard on port 3000",
                  "Perfect for custom modules",
                  "You own upgrades and uptime",
                ]}
              />
              <CompareCard
                iconName="globe"
                title="Cloud"
                desc="Best for public servers that need uptime, backups, monitoring, and fewer infrastructure tasks."
                items={[
                  "Managed runtime and deployment",
                  "Backups and service monitoring",
                  "No server maintenance for staff",
                  "Same dashboard and module model",
                  "Scale when the community grows",
                ]}
                featured
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Feature system</span>
            <h2 className="section-title">A Discord bot that behaves like a platform.</h2>
            <p className="section-subtitle">
              Stop chaining small bots together. GuildCore gives staff one place to
              configure the flows that keep the server useful, safe, and monetizable.
            </p>
          </div>

          <div className="features-grid asymmetric-grid">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                iconName={feature.iconName}
                title={feature.title}
                desc={feature.desc}
                iconClass={feature.iconClass}
                delay={i * 55}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section ops-section">
        <div className="container">
          <div className="ops-layout">
            <div className="section-copy">
              <span className="section-eyebrow">Daily operations</span>
              <h2 className="section-title">Built for the staff workflow after launch.</h2>
              <p className="section-subtitle left">
                The dashboard is not just a launch screen. It is a command center
                for daily moderation, ticket load, role changes, marketplace checks,
                and module health.
              </p>
            </div>

            <div className="ops-stack">
              <OpsRow iconName="shield" title="Prevent damage early" desc="Auto-mod and verification react before staff need to clean up a channel." />
              <OpsRow iconName="ticket" title="Keep support accountable" desc="Tickets carry status, owner, response history, and close reasons." />
              <OpsRow iconName="chart" title="Know what changed" desc="Metrics show when members join, churn, trigger rules, or need support." />
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="section">
        <div className="container">
          <div className="section-head compact">
            <span className="section-eyebrow">Module library</span>
            <h2 className="section-title">Enable only what your server needs.</h2>
          </div>

          <div className="module-pills">
            {modules.map((module, i) => (
              <div
                key={module}
                className="module-pill fade-up"
                style={{ animationDelay: `${i * 28}ms` }}
              >
                <span>{module}</span>
                <span className="chip success">Ready</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-band">
        <div className="container">
          <div className="highlight-row">
            <div className="highlight-text fade-up">
              <span className="section-eyebrow">Marketplace and safety</span>
              <h2 className="section-title">Commerce without losing control of the community.</h2>
              <p className="section-subtitle left">
                Market Hub lets you sell perks and products while Shield Core watches
                for scams, raids, impersonation, and suspicious links.
              </p>
              <ul className="checklist">
                <li><Icon name="check2" size={14} /> Seller verification before offers go live</li>
                <li><Icon name="check2" size={14} /> Staff audit log for marketplace and moderation actions</li>
                <li><Icon name="check2" size={14} /> Scam-link blocking and suspicious account review</li>
                <li><Icon name="check2" size={14} /> Clean separation between support, sales, and moderation</li>
              </ul>
            </div>
            <div className="highlight-mock fade-up delay-2">
              <MarketSafetyMock />
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head compact">
            <span className="section-eyebrow">Teams using the pattern</span>
            <h2 className="section-title">Staff-friendly, developer-friendly, member-friendly.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item, i) => (
              <article
                key={item.author}
                className="testimonial fade-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="testimonial-stars" aria-label="Five star rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon key={index} name="star" size={14} />
                  ))}
                </div>
                <blockquote>&quot;{item.quote}&quot;</blockquote>
                <footer>
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section open-source-section">
        <div className="container">
          <div className="oss-band">
            <div className="oss-copy">
              <span className="section-eyebrow">Open source CTA</span>
              <h2 className="section-title">Developed by Wersee Team for the public.</h2>
              <p className="section-subtitle left">
                GuildCore is meant to be inspected, extended, and improved by the
                community. Run it locally, change the modules, publish fixes, or keep
                your own private fork for your server.
              </p>
              <div className="action-row">
                <a
                  href="https://github.com/werseecloud/GuildCore"
                  className="btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="github" size={16} />
                  Star the repo
                </a>
                <a href="#install" className="btn-outline">
                  <Icon name="terminal" size={16} />
                  Install locally
                </a>
              </div>
            </div>

            <div className="oss-metrics" aria-label="Open-source metrics">
              <MiniMetric iconName="code" value="MIT" label="license" />
              <MiniMetric iconName="server" value="Local" label="first run mode" />
              <MiniMetric iconName="users" value="Public" label="built for" />
              <MiniMetric iconName="flame" value="Wersee" label="team" />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container faq-container">
          <div className="section-head compact">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title">Practical answers before you install.</h2>
          </div>
          <FAQ items={faq} />
        </div>
      </section>

      <section className="section final-section">
        <div className="container">
          <div className="final-band">
            <Logo size={58} withText={false} />
            <div>
              <h2 className="section-title">Run GuildCore on your own machine first.</h2>
              <p className="section-subtitle">
                Self-host the bot, open the dashboard on localhost, and decide later
                whether you want a VPS, Docker host, or managed cloud.
              </p>
            </div>
            <div className="action-row">
              <Link href="/dashboard" className="btn-primary">
                <Icon name="grid" size={15} />
                Open dashboard
              </Link>
              <a href="#install" className="btn-outline">
                <Icon name="terminal" size={16} />
                Copy install line
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-cols">
            <div>
              <Logo />
              <p className="footer-tagline">Open-source Discord infrastructure.</p>
              <p className="footer-credit">
                Developed by <a href="https://wersee.com" target="_blank" rel="noreferrer">Wersee Team</a> for the public.
              </p>
            </div>

            <FooterColumn title="Product" links={["Features", "Modules", "Self-host", "Dashboard"]} />
            <FooterColumn title="Community" links={["GitHub", "Docs", "Issues", "Discussions"]} />
            <FooterColumn title="Run" links={["Localhost", "Docker", "VPS", "Cloud"]} />
          </div>

          <div className="footer-bottom">
            <p>Copyright 2026 GuildCore. Open source under the MIT license.</p>
            <div className="footer-bottom-links">
              <a href="https://github.com/werseecloud/GuildCore" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Icon name="github" size={18} />
              </a>
              <a href="/dashboard" aria-label="Dashboard">
                <Icon name="grid" size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatCell({
  value,
  label,
  suffix = "",
  prefix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <div className="stat-cell">
      <div className="stat-value">
        {prefix}
        <AnimatedCounter value={value} />
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Step({
  n,
  iconName,
  title,
  desc,
}: {
  n: string;
  iconName: IconName;
  title: string;
  desc: string;
}) {
  return (
    <article className="step-card fade-up">
      <span className="step-num">{n}</span>
      <div className="step-icon">
        <Icon name={iconName} size={22} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}

function CompareCard({
  iconName,
  title,
  desc,
  items,
  featured = false,
}: {
  iconName: IconName;
  title: string;
  desc: string;
  items: string[];
  featured?: boolean;
}) {
  return (
    <article className={`compare-card ${featured ? "featured" : ""}`}>
      <div className="compare-head">
        <div className="feature-icon primary-gradient">
          <Icon name={iconName} size={20} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      </div>
      <ul className="checklist">
        {items.map((item) => (
          <li key={item}>
            <Icon name="check2" size={14} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function OpsRow({
  iconName,
  title,
  desc,
}: {
  iconName: IconName;
  title: string;
  desc: string;
}) {
  return (
    <article className="ops-row">
      <div className="ops-icon">
        <Icon name={iconName} size={20} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </article>
  );
}

function MiniMetric({
  iconName,
  value,
  label,
}: {
  iconName: IconName;
  value: string;
  label: string;
}) {
  return (
    <div className="oss-stat">
      <Icon name={iconName} size={18} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5>{title}</h5>
      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href={link === "Dashboard" ? "/dashboard" : "#"}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarketSafetyMock() {
  return (
    <div className="mock-card">
      <svg viewBox="0 0 560 360" width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <linearGradient id="marketBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--background-elev)" />
            <stop offset="100%" stopColor="var(--background)" />
          </linearGradient>
          <linearGradient id="marketBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="marketGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DDC86" />
            <stop offset="100%" stopColor="#2FBF71" />
          </linearGradient>
          <linearGradient id="marketAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4B860" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        <rect width="560" height="360" rx="8" fill="url(#marketBg)" />
        <rect x="24" y="24" width="168" height="18" rx="5" fill="rgba(255,255,255,0.84)" />
        <rect x="24" y="54" width="246" height="10" rx="5" fill="rgba(255,255,255,0.22)" />
        <rect x="424" y="24" width="112" height="34" rx="8" fill="url(#marketBlue)" />
        <text x="480" y="46" fontFamily="Outfit" fontWeight="700" fontSize="13" fill="white" textAnchor="middle">Approve</text>

        {[
          { y: 96, name: "Premium role", price: "EUR 4.99", sold: "142 sold", fill: "url(#marketBlue)" },
          { y: 166, name: "VIP lounge", price: "EUR 9.99", sold: "86 sold", fill: "url(#marketGreen)" },
          { y: 236, name: "Custom badge", price: "EUR 2.99", sold: "244 sold", fill: "url(#marketAmber)" },
        ].map((item) => (
          <g key={item.name}>
            <rect x="24" y={item.y} width="328" height="54" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.08)" />
            <rect x="38" y={item.y + 13} width="28" height="28" rx="7" fill={item.fill} />
            <text x="80" y={item.y + 25} fontFamily="Outfit" fontWeight="700" fontSize="13" fill="white">{item.name}</text>
            <text x="80" y={item.y + 41} fontSize="10" fill="rgba(255,255,255,0.5)">{item.sold}</text>
            <text x="330" y={item.y + 33} fontFamily="Outfit" fontWeight="700" fontSize="13" fill="white" textAnchor="end">{item.price}</text>
          </g>
        ))}

        <g transform="translate(384 96)">
          <rect width="152" height="194" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.08)" />
          <text x="18" y="30" fontFamily="Outfit" fontWeight="700" fontSize="14" fill="white">Safety queue</text>
          {[
            { y: 58, label: "Scam link", color: "#F26D5B" },
            { y: 94, label: "New seller", color: "#F4B860" },
            { y: 130, label: "Clean order", color: "#2FBF71" },
          ].map((row) => (
            <g key={row.label}>
              <rect x="16" y={row.y} width="120" height="24" rx="6" fill="rgba(255,255,255,0.05)" />
              <circle cx="30" cy={row.y + 12} r="4" fill={row.color} />
              <text x="42" y={row.y + 16} fontSize="10" fill="rgba(255,255,255,0.72)">{row.label}</text>
            </g>
          ))}
          <rect x="16" y="160" width="120" height="18" rx="9" fill="rgba(47,191,113,0.16)" stroke="rgba(47,191,113,0.35)" />
          <text x="76" y="173" fontSize="9" fill="#7DDC86" textAnchor="middle" fontWeight="700">Live review active</text>
        </g>
      </svg>
    </div>
  );
}
