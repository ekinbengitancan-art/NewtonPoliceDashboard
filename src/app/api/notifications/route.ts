import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireNewtonAccess } from "@/lib/requireNewtonAccess";

const NEWTON_GUILD_ID = "1524894549636288604";
const MANAGE_GUILD = 0x20;

async function authorize() {
  return requireNewtonAccess("sergeant");
}
export async function GET() {
  try {
    const auth = await authorize();
    if (auth.error) return auth.error;

    const notifications = await prisma.notification.findMany({
      where: { guildId: NEWTON_GUILD_ID },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        guildId: NEWTON_GUILD_ID,
        read: false,
      },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Bildirimler alınamadı." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await authorize();
    if (auth.error) return auth.error;

    const body = await request.json();

    if (body.readAll === true) {
      await prisma.notification.updateMany({
        where: {
          guildId: NEWTON_GUILD_ID,
          read: false,
        },
        data: { read: true },
      });

      return NextResponse.json({ success: true });
    }

    if (typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { error: "Geçerli bir bildirim ID'si gerekli." },
        { status: 400 }
      );
    }

    const result = await prisma.notification.updateMany({
      where: {
        id: body.id,
        guildId: NEWTON_GUILD_ID,
      },
      data: { read: true },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Bildirim bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json(
      { error: "Bildirim güncellenemedi." },
      { status: 500 }
    );
  }
}

