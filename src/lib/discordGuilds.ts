type GuildResult =
  | { ok: true; guilds: unknown[] }
  | { ok: false; status: number; message: string };

type CacheEntry = {
  expiresAt: number;
  guilds: unknown[];
};

const CACHE_DURATION = 60_000;

const cache = new Map<string, CacheEntry>();
const pending = new Map<string, Promise<GuildResult>>();

export async function getDiscordGuilds(
  accessToken: string
): Promise<GuildResult> {
  const cached = cache.get(accessToken);

  if (cached && cached.expiresAt > Date.now()) {
    return { ok: true, guilds: cached.guilds };
  }

  const existingRequest = pending.get(accessToken);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async (): Promise<GuildResult> => {
    try {
      const response = await fetch(
        "https://discord.com/api/users/@me/guilds",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const message = await response.text();
        console.error("Discord API error:", response.status, message);

        return {
          ok: false,
          status: response.status,
          message,
        };
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        return {
          ok: false,
          status: 502,
          message: "Discord sunucu listesi geçersiz.",
        };
      }

      cache.set(accessToken, {
        guilds: data,
        expiresAt: Date.now() + CACHE_DURATION,
      });

      return { ok: true, guilds: data };
    } catch (error) {
      console.error("Discord guild fetch error:", error);

      return {
        ok: false,
        status: 500,
        message: "Discord bağlantısı kurulamadı.",
      };
    } finally {
      pending.delete(accessToken);
    }
  })();

  pending.set(accessToken, request);

  return request;
}