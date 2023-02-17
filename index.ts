// Imports
const { Client, Partials, GatewayIntentBits } = require("discord.js");
import * as dotenv from "dotenv";

// Interfaces
interface User {
  id: string;
  name: string;
}

interface MessageResp {
  contains: boolean;
  name?: string;
}

// Variables
const users: User[] = [
  {
    id: "740934232838242326",
    name: "Zerio",
  },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    activities: [
      {
        name: "Moderating Zerio-Scripts",
        type: 0,
      },
    ],
    status: "dnd",
  },
});

// Functions
function checkMessage(message: string): MessageResp {
  for (let i = 0; i < users.length; i++) {
    if (message.includes(`<@${users[i].id}>`)) {
      return {
        contains: true,
        name: users[i].name,
      };
    }
  }

  return {
    contains: false,
  };
}

// Handlers
client.on("messageCreate", async (message: any) => {
  if (
    message.author.id !== process.env.BOT_ID &&
    (message.author.bot == false || process.env.DISABLE_FOR_BOTS == "true")
  ) {
    const { contains, name } = checkMessage(message.content);

    if (contains) {
      message.reply(`Dont ping ${name} please`);
      return;
    }
  }
});

// Setup
dotenv.config();
client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log("Logged in as the bot");
  })
  .catch((err: string) => {
    console.error(
      "[CRASH] Something went wrong while connecting to your bot..."
    );
    console.error("[CRASH] Error from Discord API:" + err);
    return process.exit();
  });
