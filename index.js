
// Configuring dotenv
require('dotenv').config();

// Importing dependencies && modules
const { Telegraf } = require('telegraf');

// Geting data from external files
const botToken = process.env.BOT_TOKEN;

// Creating the bot
const bot = new Telegraf(botToken);

// Creating basic functions
bot.start(ctx => {
    ctx.reply('The Bot Started Successfuly');
});

bot.help(ctx => {
    ctx.reply('Under Construction.');
});

// Launching the bot && requiring and executing external functions
bot.launch().then(() => {
    require('./commands/youtube')();
    console.log('Bot launched successfuly.');
}).catch(err => console.log(err));

// Exporting modules
module.exports = bot;