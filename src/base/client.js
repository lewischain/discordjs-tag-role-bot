// @ts-check
import { Client, IntentsBitField, Partials } from "discord.js";
import environment from "../environment.config.js";

export default class SuperClient extends Client {
  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  async initialize() {
    return this.login(environment.bot.token);
  }
}
