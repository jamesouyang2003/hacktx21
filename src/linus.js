// import { privateEncrypt } from "crypto";

// // Require the necessary discord.js classes
const fs = require('fs');
const {Client, Intents} = require('discord.js');
const {joinVoiceChannel} = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
client.login(process.env.BOT_TOKEN);

// Initializing commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => console.log('The Bot is ready!'));

//const {toneAnalyzer} = require('./analyzer');
// START OF COPIED SECTION FROM ANALYZER.TS
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const {IamAuthenticator} = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  serviceUrl: 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com',
});
// END OF COPIED SECTION FROM ANALYZER.TS

var angerThreshold = 0.6;
var joyThreshold = 0.6;
const thresholdRange = [0, 1];

function commandListen(message) {
  var member = message.member;
  if (!member) {
    return;
  }
  if (!member.voiceChannel) {
    message.reply(" you need to be in a voice channel first.");
    return;
  }
  if (listening) {
    message.reply(" a voice channel is already being listened to!");
    return;
  }

  listening = true;
  var voiceChannel = member.voiceChannel;
  voiceChannel.join().then((connection) => {
    message.reply("now inside voice channel");
  }).catch(console.error);
}

client.on('message', (msg) => {
  var params = msg.content.split(" ");
  if (params[0] === '?start') {
    commandListen(msg);
  }
});
