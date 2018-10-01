const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
let app = express();
const fs = require('fs');

const TOKEN = '547699301:AAHc4Ml2BvZDHruy3LA4wpK_fJOhXmMwqoQ';


//vlad : 546579876 polly : 644045807
const USER_ID = '546579876'


const bot = new TelegramBot(TOKEN, { polling: true };)

const COMAND_BOT = (comand) => {
    let message = '';
    switch (action) {
        case 'start':
            message = 'Каждые день в 4 утра я буду присылать тебе 5 новых слов';
            break;
        case 'test':
            message = 'test message';
        default:
            message = 'не понимаю о чем вы';
            break;
    }
    bot.onText(`/\/${comand}/`, function(msg, match) {
        chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
        bot.sendMessage(chat, message)
            .then(function(data) {
                console.log('ok')
            })
            .catch(function(err) {
                console.log(err);
            });
    });
};
    (()=>{
        let STATUS = true;
        setInterval(() => {
          
            let data = new Date();
            let hour = data.getHours();
            console.log(getHours());
            if (hour === 4) {
                if (STATUS) {
                    STATUS = false;
                    fs.readFile("hello.txt", "utf8",function(error, data) {
                        if (error) throw error;
                        data = data.replace(/\t/g, '').replace(/<br>/g, '\n');
                        wordsLng = data.split('\n').length;
                        data = data.split('\n').slice(0, 5);
                        data = data.join('\n').toString();
                        TEXT = data;
                        sendWordsToday(data);
                        log(4)
                    });
                }
            } else { STATUS = true };
        }, 100000);
    })();


const iKeys = ([
    {
        text: "выучила",
        callback_data: '1'
    },
    {
        text: "ненужные слова",
        callback_data: '2'
    },
    {
        text: "уже знаю",
        callback_data: '3'
    }
]);

bot.on('callback_query', function(msg) {
    let data = msg.data;
    if (data == '1') {
        good();
        log(1);
    }
    else if (data == '2') {
        noIntresting();
        log(2);
    }
    else {
        INow();
        log(3);
    }
});

function sendWordsToday(data = 'empti message') {
    let options = {
        reply_markup: JSON.stringify({
            inline_keyboard: iKeys,
            parse_mode: 'Markdown'
        })
    };
    bot.sendMessage(USER_ID, data, options)
        .then(function(data) {
            wordsToday = [];
            return data;
        })
        .catch(function(err) {
            console.log(err);
            return err;
        });
}

function deleteWords(againSend = false) {
    fs.readFile('hello.txt', 'utf8', function(err, TEXTFILE) {
        if (err) throw err;
        var linesExceptFirst = TEXTFILE.split('\n').slice(11).join('\n');
        fs.writeFile("hello.txt", linesExceptFirst, function(error) {
            if (error) throw error;
            console.log('данные успешно удалены');
            if (againSend) {
                linesExceptFirst = linesExceptFirst.replace(/\t/g, '').replace(/<br>/g, '\n');
                linesExceptFirst = linesExceptFirst.split('\n').slice(0, 5);
                linesExceptFirst = linesExceptFirst.join('\n').toString();
                sendWordsToday(linesExceptFirst);
            }
        });
    });
}

function INow() {
    bot.sendMessage(USER_ID, 'Сейчас дам другие')
        .then(function(data) {
            deleteWords(true)
            return data;
        })
        .catch(function(err) {
            console.log(err);
            return err;
        });
}

function noIntresting() {
    bot.sendMessage(USER_ID, `Сейчас поменяю , привереда`)
        .then(function(data) {
            // console.log(util.inspect(data, false, null));
            deleteWords(true)
            return data;
        })
        .catch(function(err) {
            console.log(err);
            return err;
        });
}
function good() {
    let message = `////////////ГОРЖУСЬ ТОБОЙ////////////
  ты выучила 5 слов из ${wordsLng - 5}
  ////////////ДО ЗАВТРА////////////`;

    bot.sendMessage(USER_ID,message )
        .then(function(data) {
            deleteWords()
            return data;
        })
        .catch(function(err) {
            console.log(err);
            return err;
        });
}

function log(action) {
    let log = '';
    let date = new Date();
    switch (action) {
        case 1:
            log = `выучила: ${date} \n`
            break;
        case 2:
            log = `ненужные : ${date} \n`
            break;
        case 3:
            log = `знает : ${date} \n`
            break;
        case 4:
            log = `получила слова : ${date} \n`
            break;
        default:
            break;
    }
    fs.appendFile("log.txt", log, function(error) {
        if (error) throw error;
    });
}

app.get('/', (req, res) => {
    res.send('good');
})
app.listen(process.env.PORT);

