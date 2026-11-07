import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

type DiscordGuild = {
  permissions: string;
  [key: string]: unknown;
};

function isDiscordGuild(value: unknown): value is DiscordGuild {
  return (
    typeof value === "object" &&
    value !== null &&
    "permissions" in value &&
    typeof (value as { permissions?: unknown }).permissions === "string"
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Discord API error:", errorData);
      return NextResponse.json({ error: "Discord API error" }, { status: response.status });
    }

    const guilds = (await response.json()) as unknown;

    if (!Array.isArray(guilds)) {
      return NextResponse.json([]);
    }

    const manageGuilds = guilds.filter((guild) => (
      isDiscordGuild(guild) && (parseInt(guild.permissions, 10) & 0x20) === 0x20
    ));

    return NextResponse.json(manageGuilds);
  } catch (error) {
    console.error("Guilds fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
