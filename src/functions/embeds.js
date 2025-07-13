// @ts-check
import { Colors, EmbedBuilder } from "discord.js";

export const BaseEmbed = () =>
  new EmbedBuilder()
    .setColor(Colors.White)
    .setTimestamp()
    .setFooter({
      iconURL:
        "https://cdn.discordapp.com/icons/1096085223881576549/ea5582e09bc06175d1c15c8324ae1e9a.webp",
      text: `Raven - Yazılım Sunucusu, 2019 - ${new Date().getFullYear()}`,
    });
