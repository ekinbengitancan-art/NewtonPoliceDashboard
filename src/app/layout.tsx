import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "GuildCore - Open-Source Discord Bot Dashboard",
  description:
    "GuildCore is an open-source Discord bot and localhost dashboard for moderation, tickets, marketplace tools, automation, and analytics.",
  keywords: "discord bot, guildcore, wersee team, open source, moderation, ticket system, localhost dashboard",
};

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('wersee-theme');
    if (!t) {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
