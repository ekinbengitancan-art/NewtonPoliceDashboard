import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireNewtonAccess } from "@/lib/requireNewtonAccess";

const NEWTON_GUILD_ID = "1524894549636288604";
const MANAGE_GUILD = 0x20;

async function authorize() {
  const auth = await requireNewtonAccess("sergeant");
  return auth.error;
}
export async function GET() {
  try {
    const authError = await authorize();
    if (authError) return authError;

    const [
      totalPersonnel,
      activePersonnel,
      totalTickets,
      openTickets,
      closedTickets,
      modActions,
      unreadNotifications,
      notifications,
      modules,
    ] = await Promise.all([
      prisma.policePersonnel.count({
        where: { guildId: NEWTON_GUILD_ID },
      }),

      prisma.policePersonnel.count({
        where: {
          guildId: NEWTON_GUILD_ID,
          status: "active",
        },
      }),

      prisma.ticket.count({
        where: { guildId: NEWTON_GUILD_ID },
      }),

      prisma.ticket.count({
        where: {
          guildId: NEWTON_GUILD_ID,
          status: "open",
        },
      }),

      prisma.ticket.count({
        where: {
          guildId: NEWTON_GUILD_ID,
          status: "closed",
        },
      }),

      prisma.modCase.count({
        where: { guildId: NEWTON_GUILD_ID },
      }),

      prisma.notification.count({
        where: {
          guildId: NEWTON_GUILD_ID,
          read: false,
        },
      }),

      prisma.notification.findMany({
        where: { guildId: NEWTON_GUILD_ID },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          createdAt: true,
          link: true,
        },
      }),

      prisma.guildModule.findMany({
        where: { guildId: NEWTON_GUILD_ID },
        select: {
          module: true,
          enabled: true,
        },
        orderBy: { module: "asc" },
      }),
    ]);

    return NextResponse.json(
      {
        stats: {
          totalPersonnel,
          activePersonnel,
          totalTickets,
          openTickets,
          closedTickets,
          modActions,
          unreadNotifications,
        },
        notifications,
        modules,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Overview API error:", error);

    return NextResponse.json(
      { error: "Dashboard istatistikleri alÄ±namadÄ±." },
      { status: 500 }
    );
  }
}

