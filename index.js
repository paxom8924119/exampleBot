const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '547699301:AAHc4Ml2BvZDHruy3LA4wpK_fJOhXmMwqoQ';

const bot= new TelegramBot(TOKEN , {polling:true})

bot.on('message' , msg =>{
    bot.sendMessage(msg.chat.id , `Hello from HEROKU , Hi, ${msg.from.first_name}`);
})