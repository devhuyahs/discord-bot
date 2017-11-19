import oversmash from 'oversmash';
const Discord = require('discord.js');
const logger = require('winston');
const music = require('discord.js-musicbot-addon');
const musicSettings = require('./settings/music');
const client = new Discord.Client();

const ow = oversmash();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

client.on('ready', () => {
  const date = new Date();
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(client.user + ' @ ' + date);
});

client.on('message', (message) => {
  if (message.content === '!help') {
    const embed = new Discord.RichEmbed()
    .setAuthor("Commands", message.author.displayAvatarURL)
    .setDescription(`Commands with a * require Admin perms.`)
    .addField('!ow [battle-tag]', 'Overwatch Details')
    .addField('!do1', `Bot leaves and clears the queue`)
    .addField('!clearqueue', `Clears the current queue.`)
    .addField('!help', `Displays this text.`)
    .addField('!play', `Queue a song by url or search.`)
    .addField('!skip', `Skip a song or mutli songs.`)
    .addField('!queue', `Shows the current queue`)
    .addField('!pause', `Pauses the queue.`)
    .addField('!resume', `Resume the queue.`)
    .addField('!volume [% - 100]', `Adjusts the volume of the bot.`)
    .setColor(0x27e33d)
    message.channel.send({embed});
  }
  if (message.content.toLowerCase().startsWith("!ow")) {
    const args = message.content.slice("!".length).trim().split(/ +/g);
    let battleTag = args.slice(1).join(" ");
    ow.playerStats(battleTag, 'eu', 'pc').then(player => {
      const embed = new Discord.RichEmbed()
      .setAuthor("Overwatch:", message.author.displayAvatarURL)
      .setDescription(`:yum: Stats here bois:`)
      .addField(`Player Name:`, player.name)
      .addField(`Quickplay Elims:`, player.stats.quickplay.all.combat.eliminations)
      .addField(`Quickplay Multikills:`, player.stats.quickplay.all.combat.multikills)
      .addField(`Quickplay Boops:`, player.stats.quickplay.all.combat.environmental_kills)
      .addField(`Quickplay Obj Kills:`, player.stats.quickplay.all.combat.objective_kills)
      .addField(`Quickplay Final Blows:`, player.stats.quickplay.all.combat.final_blows)
      .addField(`Quickplay Best Killstreak:`, player.stats.quickplay.all.best.eliminations_most_in_game)
      .addField(`Quickplay Solo Kills - Most in Game:`, player.stats.quickplay.all.best.final_blows_most_in_game)
      .addField(`Quickplay Time on Fire - Most in Game:`, player.stats.quickplay.all.best.time_spent_on_fire_most_in_game)
      .setColor(0xfff000)
      message.reply({embed});
    });
  }
});

music(client, musicSettings);

client.login(process.env.AUTH_TOKEN);
