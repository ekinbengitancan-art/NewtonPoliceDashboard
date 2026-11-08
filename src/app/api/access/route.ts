import { NextResponse } from "next/server";
import { requireNewtonAccess } from "@/lib/requireNewtonAccess";

export async function GET() {
  const auth = await requireNewtonAccess("sergeant");

  if (auth.error || !auth.level) {
    return auth.error ?? NextResponse.json(
      { error: "Erişim reddedildi." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    level: auth.level,
  });
}
