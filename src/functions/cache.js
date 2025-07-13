// @ts-check
import { Guild } from "discord.js";
import client from "../client.js";
import { logger } from "../modules/variables.js";

/**
 * @typedef {"Guild" | "Channel" | "Role" | "User" | "Member"} CacheTypeKey
 */

export const CacheType = {
  Guild: () => client.guilds.cache,
  Channel: (/** @type {Guild | undefined} */ guild) => guild?.channels?.cache,
  Role: (/** @type {Guild | undefined} */ guild) => guild?.roles?.cache,
  User: () => client.users.cache,
  Member: (/** @type {Guild | undefined} */ guild) => guild?.members.cache,
};

/**
 * @param {Object} params
 * @param {CacheTypeKey} params.cacheType
 * @param {string | undefined} params.id
 * @param {Guild} [params.guild]
 * @return {any}
 */
export function getCache({ cacheType, id, guild }) {
  if (!id) {
    const message = `Beklenen "${cacheType}" ID değeri sağlanmadı.`;
    logger.error(message);
    throw new Error(message);
  }

  const selector = CacheType[cacheType];
  if (!selector) {
    const message = `Cache tipi hatası: "${cacheType}". Desteklenen tipler: Guild, Channel, Role.`;
    logger.error(message);
    throw new Error(message);
  }

  const cache = selector(guild);
  if (!cache) {
    const message = `Cache "${cacheType}" için erişilemedi. ${cacheType !== "Guild" ? "Muhtemelen 'guild' nesnesi geçersiz veya tanımsız." : ""}`;
    logger.error(message);
    throw new Error(message);
  }

  const item = cache.get(id);
  if (!item) {
    const message = `"${cacheType}" bulunamadı. Sağlanan ID: "${id}". Nesne önbelleğe alınmamış olabilir veya geçersiz bir ID girilmiş olabilir.`;
    logger.error(message);
    throw new Error(message);
  }

  return item;
}
