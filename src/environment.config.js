// @ts-check
import dotenv from "dotenv";
import z from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
  DISCORD_TOKEN: z.string().nonempty(),
	DISCORD_ID: z.string().nonempty(),
	DISCORD_GUILD_ROLE_ID: z.string().nonempty(),
	DISCORD_GUILD_CHANNEL_ID: z.string().nonempty(),
	DISCORD_GUILD_ID: z.string().nonempty(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Environment variable validation failed:", z.treeifyError(parsedEnv.error));
}

const environment = {
	guild: {
		id: process.env.DISCORD_GUILD_ID,
		channel: { id: process.env.DISCORD_GUILD_CHANNEL_ID },
		role: { id: process.env.DISCORD_GUILD_ROLE_ID },
	},
	bot: {
		token: process.env.DISCORD_TOKEN
	},
};

export default environment;