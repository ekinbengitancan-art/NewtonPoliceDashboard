"use client";

export default function DashboardPreview() {
  return (
    <div className="hero-preview-card">
      <svg viewBox="0 0 1120 640" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="GuildCore dashboard preview">
        <defs>
          <linearGradient id="dpBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--background-elev)" />
            <stop offset="100%" stopColor="var(--background)" />
          </linearGradient>
          <linearGradient id="dpBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="dpGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DDC86" />
            <stop offset="100%" stopColor="#2FBF71" />
          </linearGradient>
          <linearGradient id="dpAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4B860" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="dpCoral" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8A66" />
            <stop offset="100%" stopColor="#F26D5B" />
          </linearGradient>
          <linearGradient id="dpArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1120" height="640" rx="8" fill="url(#dpBg)" />
        <rect x="1" y="1" width="1118" height="638" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" />

        <g transform="translate(24 22)">
          <circle cx="0" cy="0" r="6" fill="#F26D5B" />
          <circle cx="24" cy="0" r="6" fill="#F4B860" />
          <circle cx="48" cy="0" r="6" fill="#2FBF71" />
          <rect x="384" y="-8" width="260" height="18" rx="8" fill="rgba(255,255,255,0.06)" />
          <text x="514" y="5" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="middle">localhost:3000/dashboard</text>
        </g>

        <g transform="translate(24 66)">
          <rect width="238" height="548" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.08)" />
          <g transform="translate(22 22)">
            <path d="M22 0 L44 13 L44 38 L22 51 L0 38 L0 13 Z" fill="url(#dpBlue)" />
            <path d="M22 9 L8 17 V34 L14 37 V28 H23 V23 H14 V17 H33 V25 H40 V13 Z M23 29 V38 H33 V34 H40 V41 H23 Z" fill="rgba(255,255,255,0.9)" />
            <text x="64" y="24" fontFamily="Outfit" fontWeight="800" fontSize="18" fill="white">GuildCore</text>
            <text x="64" y="42" fontSize="10" fill="rgba(255,255,255,0.46)">Wersee Team public build</text>
          </g>

          <g transform="translate(20 100)">
            {[
              ["Overview", "url(#dpBlue)", 0],
              ["Modules", "rgba(255,255,255,0.18)", 44],
              ["Moderation", "rgba(255,255,255,0.18)", 88],
              ["Tickets", "rgba(255,255,255,0.18)", 132],
              ["Marketplace", "rgba(255,255,255,0.18)", 176],
              ["Settings", "rgba(255,255,255,0.18)", 220],
            ].map(([label, fill, y], index) => (
              <g key={label as string} transform={`translate(0 ${y})`}>
                <rect width="198" height="34" rx="8" fill={index === 0 ? "rgba(59,130,246,0.16)" : "transparent"} stroke={index === 0 ? "rgba(59,130,246,0.36)" : "transparent"} />
                <rect x="12" y="10" width="14" height="14" rx="4" fill={fill as string} />
                <text x="38" y="22" fontSize="11" fontWeight={index === 0 ? 700 : 500} fill={index === 0 ? "white" : "rgba(255,255,255,0.52)"}>{label as string}</text>
              </g>
            ))}
          </g>

          <rect x="20" y="482" width="198" height="42" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
          <circle cx="42" cy="503" r="12" fill="url(#dpGreen)" />
          <rect x="64" y="493" width="86" height="8" rx="4" fill="rgba(255,255,255,0.58)" />
          <rect x="64" y="508" width="120" height="6" rx="3" fill="rgba(255,255,255,0.24)" />
        </g>

        <g transform="translate(292 82)">
          <text x="0" y="0" fontFamily="Outfit" fontWeight="800" fontSize="26" fill="white">Community command center</text>
          <text x="0" y="28" fontSize="12" fill="rgba(255,255,255,0.48)">GuildCore identity, local hosting status, and live module health.</text>
          <rect x="630" y="-22" width="164" height="38" rx="8" fill="url(#dpBlue)" />
          <text x="712" y="2" fontFamily="Outfit" fontWeight="700" fontSize="13" fill="white" textAnchor="middle">Save changes</text>
        </g>

        <g transform="translate(292 132)">
          <rect width="794" height="88" rx="8" fill="rgba(59,130,246,0.10)" stroke="rgba(59,130,246,0.32)" />
          <text x="22" y="32" fontFamily="Outfit" fontWeight="800" fontSize="18" fill="white">GuildCore public dashboard</text>
          <text x="22" y="56" fontSize="11" fill="rgba(255,255,255,0.56)">Developed by Wersee Team for the public. Localhost ready after install.</text>
          <rect x="602" y="24" width="154" height="28" rx="8" fill="rgba(47,191,113,0.14)" stroke="rgba(47,191,113,0.32)" />
          <circle cx="622" cy="38" r="4" fill="#2FBF71" />
          <text x="684" y="42" fontSize="10" fill="#7DDC86" textAnchor="middle" fontWeight="700">localhost active</text>
        </g>

        {[
          { x: 292, label: "MEMBERS", value: "12,482", color: "url(#dpBlue)", stroke: "#3B82F6" },
          { x: 494, label: "ACTIVE", value: "2,103", color: "url(#dpGreen)", stroke: "#2FBF71" },
          { x: 696, label: "TICKETS", value: "156", color: "url(#dpAmber)", stroke: "#F4B860" },
          { x: 898, label: "SHIELD", value: "94%", color: "url(#dpCoral)", stroke: "#F26D5B" },
        ].map((card) => (
          <g key={card.label} transform={`translate(${card.x} 246)`}>
            <rect width="188" height="96" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.08)" />
            <rect width="188" height="3" rx="2" fill={card.color} />
            <text x="16" y="30" fontSize="10" fontWeight="700" fill="rgba(255,255,255,0.44)">{card.label}</text>
            <text x="16" y="62" fontFamily="Outfit" fontWeight="800" fontSize="24" fill="white">{card.value}</text>
            <polyline
              points="110,74 122,64 134,68 146,54 158,60 172,46"
              fill="none"
              stroke={card.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        <g transform="translate(292 374)">
          <rect width="518" height="218" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.08)" />
          <text x="22" y="34" fontFamily="Outfit" fontWeight="800" fontSize="17" fill="white">Member growth and staff load</text>
          <text x="22" y="56" fontSize="11" fill="rgba(255,255,255,0.44)">Live trend from the local dashboard preview.</text>
          {[0, 1, 2, 3].map((line) => (
            <line key={line} x1="22" x2="496" y1={92 + line * 32} y2={92 + line * 32} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 5" />
          ))}
          <path
            d="M28,184 C84,150 128,166 176,128 C222,92 266,120 314,102 C362,84 402,110 446,70 C474,48 492,56 504,44 L504,198 L28,198 Z"
            fill="url(#dpArea)"
          />
          <path
            d="M28,184 C84,150 128,166 176,128 C222,92 266,120 314,102 C362,84 402,110 446,70 C474,48 492,56 504,44"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="446" cy="70" r="5" fill="#7DDC86" />
        </g>

        <g transform="translate(838 374)">
          <rect width="248" height="218" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.08)" />
          <text x="20" y="34" fontFamily="Outfit" fontWeight="800" fontSize="17" fill="white">Module health</text>
          {[
            { y: 62, label: "Shield Core", value: 92, color: "#2FBF71" },
            { y: 104, label: "Tickets", value: 78, color: "#3B82F6" },
            { y: 146, label: "Market Hub", value: 64, color: "#F4B860" },
          ].map((row) => (
            <g key={row.label}>
              <text x="20" y={row.y} fontSize="11" fill="rgba(255,255,255,0.62)">{row.label}</text>
              <rect x="20" y={row.y + 10} width="196" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
              <rect x="20" y={row.y + 10} width={(196 * row.value) / 100} height="8" rx="4" fill={row.color} />
            </g>
          ))}
          <rect x="20" y="184" width="114" height="20" rx="8" fill="rgba(47,191,113,0.14)" stroke="rgba(47,191,113,0.32)" />
          <text x="77" y="198" textAnchor="middle" fontSize="9" fill="#7DDC86" fontWeight="800">All systems ready</text>
        </g>
      </svg>
    </div>
  );
}
