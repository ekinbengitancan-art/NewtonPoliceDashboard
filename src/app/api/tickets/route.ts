
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { requireNewtonAccess } from "@/lib/requireNewtonAccess";

const GUILD_ID = "1524894549636288604";

type DiscordGuild = {
  id: string;
  owner?: boolean;
  permissions?: string;
};

async function authorize() {
  const auth = await requireNewtonAccess("supervisory");

  return {
    error: auth.error,
    actorId: auth.session?.user?.id ?? null,
  };
}
function botConfig() {
  const url = process.env.BOT_API_URL;
  const secret = process.env.BOT_API_SECRET;

  if (!url || !secret) {
    throw new Error("Bot API environment variables are missing.");
  }

  return { url: url.replace(/\/$/, ""), secret };
}

export async function GET() {
  const auth = await authorize();
  if (auth.error) return auth.error;

  try {
    const { url, secret } = botConfig();

    const response = await fetch(`${url}/tickets`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Bot API baÄŸlantÄ±sÄ± kurulamadÄ±." },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await authorize();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();

    if (
      typeof body.ticketId !== "string" ||
      !["claim", "close"].includes(body.action)
    ) {
      return NextResponse.json(
        { error: "GeÃ§ersiz ticket isteÄŸi." },
        { status: 400 }
      );
    }

    const { url, secret } = botConfig();

    const response = await fetch(`${url}/tickets/${body.action}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: body.ticketId,
        actorId: auth.actorId,
      }),
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Bot API baÄŸlantÄ±sÄ± kurulamadÄ±." },
      { status: 503 }
    );
  }
}


