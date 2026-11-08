import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import {
  getNewtonAccess,
  hasNewtonPermission,
  type NewtonAccessLevel,
} from "@/lib/discordAccess";

export async function requireNewtonAccess(
  required: NewtonAccessLevel
) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || !session.user?.id) {
    return {
      session: null,
      level: null,
      error: NextResponse.json(
        { error: "Oturum açmanız gerekiyor." },
        { status: 401 }
      ),
    };
  }

  const access = await getNewtonAccess(session.accessToken);

  if (!access.ok) {
    return {
      session: null,
      level: null,
      error: NextResponse.json(
        { error: access.message },
        { status: access.status }
      ),
    };
  }

  if (!hasNewtonPermission(access.level, required)) {
    return {
      session: null,
      level: null,
      error: NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmuyor." },
        { status: 403 }
      ),
    };
  }

  return {
    session,
    level: access.level,
    error: null,
  };
}
