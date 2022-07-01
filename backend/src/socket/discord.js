const { Client, Intents } = require("discord.js");
const cron = require("node-cron");
const Submission = require("../models/Submission");

const dotenv = require("dotenv");

dotenv.config();
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

client.once("ready", async () => {
  console.log(`READY`);
  cron.schedule("59 23 * * 5", () => {
    console.log("Cron Starting");
    const roleThreeSubmissionsRemaining = client.guilds.cache
      .first()
      .roles.cache.find((role) => role.name === "Play Of The Week 3/3");
    client.guilds.cache.first().members.cache.forEach((member) => {
      member.roles.add(roleThreeSubmissionsRemaining).catch(console.error);
    });
  });
});

client.on("messageCreate", async (message) => {
  if (message.channelId === process.env.PLAY_OF_THE_WEEK_CHANNEL_ID) {
    let submission;
    let attachment = message.attachments.first();
    let embed = message.embeds[0];
    if (attachment && attachment.contentType === "video/quicktime") {
      submission = {
        id: message.id,
        url: attachment.proxyURL,
        username: message.author.username,
      };
    }
    if (embed && embed.url) {
      submission = {
        id: message.id,
        url: embed.url,
        username: message.author.username,
      };
    }
    const member = message.member;
    const roleThreeSubmissionsRemaining = member.guild.roles.cache.find(
      (role) => role.name === "Play Of The Week 3/3"
    );
    const roleTwoSubmissionsRemaining = member.guild.roles.cache.find(
      (role) => role.name === "Play Of The Week 2/3"
    );
    const roleOneubmissionRemaining = member.guild.roles.cache.find(
      (role) => role.name === "Play Of The Week 1/3"
    );

    if (submission) {
      console.log({ submission, message });
      await Submission.create(submission).catch(errHandler);
      if (
        member.roles.cache.some(
          (role) => role.name === roleThreeSubmissionsRemaining.name
        )
      ) {
        member.roles.remove(roleThreeSubmissionsRemaining).catch(console.error);
        member.roles.add(roleTwoSubmissionsRemaining).catch(console.error);
      } else if (
        member.roles.cache.some(
          (role) => role.name === roleTwoSubmissionsRemaining.name
        )
      ) {
        member.roles.remove(roleTwoSubmissionsRemaining).catch(console.error);
        member.roles.add(roleOneubmissionRemaining).catch(console.error);
      } else if (
        member.roles.cache.some(
          (role) => role.name === roleOneubmissionRemaining.name
        )
      ) {
        member.roles.remove(roleOneubmissionRemaining).catch(console.error);
      }
    }
  }
});

client.login(token);
const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = client;
