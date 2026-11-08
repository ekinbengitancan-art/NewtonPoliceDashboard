import { getDiscordGuilds } from "@/lib/discordGuilds";

export const NEWTON_GUILD_ID = "1524894549636288604";

export const NEWTON_ROLES = {
  sergeant: "1524894549649002589",
  supervisory: "1524894549636288613",
  command: "1524894549636288612",
} as const;

export type NewtonAccessLevel =
  | "sergeant"
  | "supervisory"
  | "command";

type DiscordGuild = {
  id: string;
  name?: string;
  owner?: boolean;
  permissions?: string;
  [key: string]: unknown;
};

type AccessResult =
  | {
      ok: true;
      level: NewtonAccessLevel;
      guild: DiscordGuild;
      roles: string[];
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

const LEVELS: Record<NewtonAccessLevel, number> = {
  sergeant: 1,
  supervisory: 2,
  command: 3,
};

export async function getNewtonAccess(
  accessToken: string
): Promise<AccessResult> {
  const guildResult = await getDiscordGuilds(accessToken);

  if (!guildResult.ok) {
    return {
      ok: false,
      status: guildResult.status,
      message: "Discord sunucu bilgileri alınamadı.",
    };
  }

  const guilds = guildResult.guilds as DiscordGuild[];
  const guild = guilds.find(
    (item) => item && item.id === NEWTON_GUILD_ID
  );

  if (!guild) {
    return {
      ok: false,
      status: 403,
      message: "Newton Police Station sunucusuna üye değilsiniz.",
    };
  }

  // Sunucu sahibi ve Manage Server yetkilisi mevcut yönetici erişimini korur.
  let isAdministrator = guild.owner === true;

  try {
    const permissions = BigInt(guild.permissions ?? "0");
    isAdministrator ||= (permissions & BigInt(0x20)) !== BigInt(0);
  } catch {
    // Geçersiz permission değeri yönetici yetkisi vermez.
  }

  if (isAdministrator) {
    return {
      ok: true,
      level: "command",
      guild,
      roles: [],
    };
  }

  try {
    const response = await fetch(
      `https://discord.com/api/users/@me/guilds/${NEWTON_GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error(
        "Discord member role request failed:",
        response.status,
        details
      );

      return {
        ok: false,
        status: response.status === 401 ? 401 : 403,
        message:
          "Discord rol bilgileri alınamadı. Oturumu kapatıp tekrar giriş yapın.",
      };
    }

    const member: unknown = await response.json();

    if (
      !member ||
      typeof member !== "object" ||
      !("roles" in member) ||
      !Array.isArray(member.roles)
    ) {
      return {
        ok: false,
        status: 502,
        message: "Discord rol yanıtı geçersiz.",
      };
    }

    const roles = member.roles.filter(
      (role: unknown): role is string => typeof role === "string"
    );

    let level: NewtonAccessLevel | null = null;

    if (roles.includes(NEWTON_ROLES.command)) {
      level = "command";
    } else if (roles.includes(NEWTON_ROLES.supervisory)) {
      level = "supervisory";
    } else if (roles.includes(NEWTON_ROLES.sergeant)) {
      level = "sergeant";
    }

    if (!level) {
      return {
        ok: false,
        status: 403,
        message: "Dashboard erişimi için gerekli rolünüz bulunmuyor.",
      };
    }

    return {
      ok: true,
      level,
      guild,
      roles,
    };
  } catch (error) {
    console.error("Newton role authorization error:", error);

    return {
      ok: false,
      status: 503,
      message: "Discord rol kontrolü şu anda yapılamıyor.",
    };
  }
}

export function hasNewtonPermission(
  current: NewtonAccessLevel,
  required: NewtonAccessLevel
): boolean {
  return LEVELS[current] >= LEVELS[required];
}
