const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
   client.user.setStatus("dnd");
  client.user.setGame(`in ${client.guilds.size} servere | -help`);
});


client.on('message', msg => {
  if (msg.content === 'Buna') {
    msg.reply('Hey,esti bine?');
  }
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loadind  ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Command: ${props.help.name} loaded.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  if (message.author.id === settings.ownerid) permlvl = 4;
  return permlvl;
};


var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on('message', message => {
  if (message.content.toLowerCase().startsWith('-ban')) {
      let member = message.mentions.members.first();
      let reason = message.content.split(' ').slice(2).join(' ');
    if(!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) return message.channel.send(":warning:  Sorry, but you do not have access to the Ban command.!");
    if(!member) return message.channel.send(":warning:  You forgot to mention who you want to give Ban!");
    if(!member.kickable)  return message.channel.send("`:warning: This person can not be given out of the server!`");
    if(!reason) return message.channel.send("`:warning: You forgot to put the reason why you gave him Ban " + member.tag + " !`");
    member.ban(reason)
    .catch(error => message.channel.send(`**Sorry ${message.author.tag} but I could not give the Ban : ${error}**`));
    message.channel.send(`**${member.user.tag}** has been banished by **${message.author.tag}** Reason: ${reason}`);
  }
  })

client.login('NDM0NjQzOTEyNDk4MzQ4MDMy.DbNZNg.B_CFCYBast_83NGqKdXuMrdsT3E');