
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireNewtonAccess } from "@/lib/requireNewtonAccess";

const NEWTON_GUILD_ID = "1524894549636288604";
const MANAGE_GUILD = 0x20;

function isValidPhotoUrl(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.startsWith("/uploads/personnel/") &&
    !value.includes("..")
  );
}

// Yetki kontrolÃ¼
async function authorize(required: "sergeant" | "supervisory" | "command" = "sergeant") {
  return requireNewtonAccess(required);
}
// Personelleri listele
export async function GET() {
  try {
    const auth = await authorize("sergeant");
    if (auth.error) return auth.error;

    const personnel = await prisma.policePersonnel.findMany({
      where: { guildId: NEWTON_GUILD_ID },
      select: {
        id: true,
        discordId: true,
        badgeNumber: true,
        firstName: true,
        lastName: true,
        callsign: true,
        rank: true,
        division: true,
        status: true,
        hireDate: true,
        notes: true,
        photoUrl: true,
      },
      orderBy: [
        { rank: "asc" },
        { badgeNumber: "asc" },
      ],
    });

    return NextResponse.json(personnel);
  } catch (error) {
    console.error("Personnel GET error:", error);

    return NextResponse.json(
      { error: "Personel listesi alÄ±namadÄ±." },
      { status: 500 }
    );
  }
}

// Yeni personel ekle
export async function POST(request: Request) {
  try {
    const auth = await authorize("supervisory");
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "GeÃ§ersiz istek." },
        { status: 400 }
      );
    }

    const {
      discordId,
      badgeNumber,
      firstName,
      lastName,
      callsign,
      rank,
      division,
      status,
      notes,
      hireDate,
      photoUrl,
    } = body;

    if (
      ![discordId, badgeNumber, firstName, lastName].every(
        (value) => typeof value === "string" && value.trim().length > 0
      )
    ) {
      return NextResponse.json(
        { error: "Discord ID, rozet numarasÄ±, ad ve soyad zorunludur." },
        { status: 400 }
      );
    }

    if (
      [discordId, badgeNumber, firstName, lastName].some(
        (value: string) => value.trim().length > 100
      )
    ) {
      return NextResponse.json(
        { error: "Girilen bilgiler Ã§ok uzun." },
        { status: 400 }
      );
    }

    if (photoUrl !== undefined && photoUrl !== null && !isValidPhotoUrl(photoUrl)) {
      return NextResponse.json(
        { error: "FotoÄŸraf yolu geÃ§ersiz." },
        { status: 400 }
      );
    }
await prisma.guild.upsert({
  where: {
    id: "1524894549636288604",
  },
  update: {
    name: "Newton Police Station | 13",
  },
  create: {
    id: "1524894549636288604",
    name: "Newton Police Station | 13",
    ownerId: String(auth.session!.user.id),
  },
});    const personnel = await prisma.policePersonnel.create({
      data: {
        guildId: NEWTON_GUILD_ID,
        discordId: discordId.trim(),
        badgeNumber: badgeNumber.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        callsign:
          typeof callsign === "string" ? callsign.trim() || null : null,
        rank:
          typeof rank === "string" && rank.trim()
            ? rank.trim()
            : "Officer",
        division:
          typeof division === "string" && division.trim()
            ? division.trim()
            : "Patrol",
        status:
          typeof status === "string" && status.trim()
            ? status.trim()
            : "active",
        notes:
          typeof notes === "string" ? notes.trim() || null : null,
        photoUrl: photoUrl || null,
        ...(hireDate && !Number.isNaN(Date.parse(hireDate))
          ? { hireDate: new Date(hireDate) }
          : {}),
      },
    });

    await prisma.notification.create({
      data: {
        guildId: NEWTON_GUILD_ID,
        type: "personnel_added",
        title: "Yeni personel eklendi",
        message: `${personnel.firstName} ${personnel.lastName} kadroya eklendi. Rozet: ${personnel.badgeNumber}`,
        link: "/dashboard?tab=personnel",
      },
    });

    return NextResponse.json(personnel, { status: 201 });
  } catch (error: any) {
    console.error("Personnel POST error:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Bu Discord ID veya rozet numarasÄ± zaten kayÄ±tlÄ±." },
        { status: 409 }
      );
    }

    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Sunucu kaydÄ± bulunamadÄ±. Ã–nce sunucu kaydÄ± oluÅŸturulmalÄ±." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Personel eklenirken bir hata oluÅŸtu." },
      { status: 500 }
    );
  }
}

// Personel bilgilerini gÃ¼ncelle
export async function PATCH(request: Request) {
  try {
    const auth = await authorize("supervisory");
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);

    if (!body || typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { error: "GeÃ§erli personel ID'si gerekli." },
        { status: 400 }
      );
    }

    const existing = await prisma.policePersonnel.findFirst({
      where: {
        id: body.id,
        guildId: NEWTON_GUILD_ID,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Personel bulunamadÄ±." },
        { status: 404 }
      );
    }

    const fields = [
      "discordId",
      "badgeNumber",
      "firstName",
      "lastName",
      "callsign",
      "rank",
      "division",
      "status",
      "notes",
      "photoUrl",
    ];

    const updateData: Record<string, any> = {};

    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        const value = body[field];

        if (
          field === "callsign" ||
          field === "notes" ||
          field === "photoUrl"
        ) {
          if (value !== null && typeof value !== "string") {
            return NextResponse.json(
              { error: `${field} alanÄ± geÃ§ersiz.` },
              { status: 400 }
            );
          }

          if (
            field === "photoUrl" &&
            value !== null &&
            !isValidPhotoUrl(value)
          ) {
            return NextResponse.json(
              { error: "FotoÄŸraf yolu geÃ§ersiz." },
              { status: 400 }
            );
          }

          updateData[field] =
            typeof value === "string" ? value.trim() || null : null;
        } else {
          if (typeof value !== "string" || !value.trim()) {
            return NextResponse.json(
              { error: `${field} alanÄ± boÅŸ bÄ±rakÄ±lamaz.` },
              { status: 400 }
            );
          }

          if (value.trim().length > 100) {
            return NextResponse.json(
              { error: `${field} alanÄ± Ã§ok uzun.` },
              { status: 400 }
            );
          }

          updateData[field] = value.trim();
        }
      }
    }

    if (body.hireDate !== undefined) {
      const date = new Date(body.hireDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Ä°ÅŸe baÅŸlama tarihi geÃ§ersiz." },
          { status: 400 }
        );
      }

      updateData.hireDate = date;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "GÃ¼ncellenecek bir bilgi gÃ¶nderilmedi." },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const personnel = await tx.policePersonnel.update({
        where: { id: existing.id },
        data: updateData,
      });

      if (updateData.rank && updateData.rank !== existing.rank) {
        await tx.policeRankHistory.create({
          data: {
            guildId: NEWTON_GUILD_ID,
            personnelId: existing.id,
            previousRank: existing.rank,
            newRank: updateData.rank,
            changedBy: auth.session!.user!.id!,
            reason:
              typeof body.reason === "string"
                ? body.reason.trim()
                : null,
          },
        });
      }

      return personnel;
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Personnel PATCH error:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Bu Discord ID veya rozet numarasÄ± baÅŸka bir personelde kayÄ±tlÄ±.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Personel gÃ¼ncellenirken bir hata oluÅŸtu." },
      { status: 500 }
    );
  }
}

// Personel kaydÄ±nÄ± sil
export async function DELETE(request: Request) {
  try {
    const auth = await authorize("command");
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);

    if (!body || typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { error: "Silinecek personel ID'si gerekli." },
        { status: 400 }
      );
    }

    const deleted = await prisma.policePersonnel.deleteMany({
      where: {
        id: body.id,
        guildId: NEWTON_GUILD_ID,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Personel bulunamadÄ±." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Personel kaydÄ± silindi.",
    });
  } catch (error) {
    console.error("Personnel DELETE error:", error);

    return NextResponse.json(
      { error: "Personel silinirken bir hata oluÅŸtu." },
      { status: 500 }
    );
  }
}


