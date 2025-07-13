// @ts-check
import { Colors, userMention } from "discord.js";
import client from "./client.js";
import db from "./db.js";
import environment from "./environment.config.js";
import { getCache } from "./functions/cache.js";
import { BaseEmbed } from "./functions/embeds.js";
import { logger } from "./modules/variables.js";

client.once("ready", () =>
  logger.success("Bot başarıyla Discord'a giriş yaptı.")
);

client.on("raw", (pkg) => {
  if (pkg.t !== "GUILD_MEMBER_UPDATE") return;
  if (pkg.d.user?.primary_guild?.badge?.identity_enabled === false)
    return db.set("base", {});

  /**
   * @type {{
   *  guild?: import("discord.js").Guild;
   *  channel?: import("discord.js").GuildTextBasedChannel;
   *  role?: import("discord.js").Role;
   *  member?: import("discord.js").GuildMember;
   * }}
   */
  let { guild, channel, role, member } = {};

  try {
    guild = getCache({
      cacheType: "Guild",
      id: environment.guild.id,
    });

    channel = getCache({
      cacheType: "Channel",
      id: environment.guild.channel.id,
      guild,
    });

    role = getCache({
      cacheType: "Role",
      id: environment.guild.role.id,
      guild,
    });

    member = getCache({
      cacheType: "Member",
      id: pkg.d.user?.id,
      guild,
    });
  } catch (error) {
    logger.error("Cache yüklenemedi:", error);
    return;
  }

  /** @type {string} */
  const guildId = pkg.d.user?.primary_guild?.identity_guild_id;

  const badgeImage = `https://cdn.discordapp.com/clan-badges/${guild?.id}/${pkg.d.user?.primary_guild?.badge}.png?size=4096`;

  if (guildId === environment.guild.id) {
    if (db.has(`base.${member?.id}`)) return;
    db.set(`base.${member?.id}`, Date.now());

    member?.roles.add(role?.id ?? "");
    channel?.send({
      content: userMention(member?.id ?? ""),
      embeds: [
        BaseEmbed()
          .setAuthor({
            name: `Hoşgeldin ${member?.user.displayName}!`,
            iconURL: member?.displayAvatarURL(),
          })
          .setTitle("Bizi Desteklediğin İçin Teşekkürler!")
          .setThumbnail(badgeImage)
          .setDescription(
            "> Sunucumuzun etiketini (tag'ini)  aldığın için teşekkürler! Artık topluluğumuzu temsil ediyorsun. Bu etiketi taşıdığın sürece bu özel role sahip olacaksın."
          ),
      ],
    });
  } else {
    if (!db.has(`base.${member?.id}`)) return;
    db.delete(`base.${member?.id}`);

    member?.roles.remove(role?.id ?? "");
    channel?.send({
      embeds: [
        BaseEmbed()
          .setColor(Colors.Red)
          .setAuthor({
            name: `Görüşürüz ${member?.user.displayName}!`,
            iconURL: member?.displayAvatarURL(),
          })
          .setTitle("Seni Özleyeceğiz.")
          .setDescription(
            "> Sunucu etiketini ismindeki kaldırdığın için temsilci rolün de kaldırıldı. Yeniden topluluğu temsil etmek istersen, etiketi ismine eklemen yeterli!"
          )
          .setThumbnail(badgeImage),
      ],
    });
  }
});

await client.initialize();
