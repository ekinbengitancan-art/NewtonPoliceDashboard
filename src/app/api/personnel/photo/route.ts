import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireNewtonAccess } from "@/lib/requireNewtonAccess";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await requireNewtonAccess("supervisory");

    if (auth.error) {
      return auth.error;
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Fotoğraf seçilmedi." },
        { status: 400 }
      );
    }

    const allowedTypes: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };

    const extension = allowedTypes[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Yalnızca JPG, PNG ve WEBP fotoğrafları yükleyebilirsiniz." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024 || file.size === 0) {
      return NextResponse.json(
        { error: "Fotoğraf boş olamaz ve en fazla 5 MB olabilir." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${randomUUID()}${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "personnel"
    );

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, fileName), buffer);

    return NextResponse.json({
      success: true,
      photoUrl: `/uploads/personnel/${fileName}`,
    });
  } catch (error) {
    console.error("Personnel photo upload error:", error);

    return NextResponse.json(
      { error: "Fotoğraf yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
