const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const TOKEN = '547699301:AAHc4Ml2BvZDHruy3LA4wpK_fJOhXmMwqoQ';

//546579876 644045807
const user_id = 644045807;

const bot = new TelegramBot(TOKEN, {
    polling: true
})

bot.onText(/\/start/, function(msg, match) {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, `Каждые день в 4 утра я буду присылать тебе 5 новых слов`)
        .then(function(data) {
            console.log('good test')
        })
        .catch(function(err) {
            console.log(err);
        });
});
bot.onText(/\/test/, function(msg, match) {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, 'test message')
        .then(function(data) {
            console.log('good test')
        })
        .catch(function(err) {
            console.log(err);
        });
});

function init() {
    setInterval(() => {
        let status = true;
        let data = new Date();
        let hour = data.getHours();
        if (hour === 4) {
            if (status) {
                status = false;
                fs.readFile("hello.txt", "utf8",
                    function(error, data) {
                        console.log('ok')
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
        } else { status = true };
    }, 600000);
}
init();


var iKeys = [];
iKeys.push([
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
    console.log(msg)
    if (data == '1') { good(); log(1) }
    else if (data == '2') { noIntresting(); log(2) }
    else { INow(); log(3) }

});

function sendWordsToday(data = 'qwe') {
    let options = {
        reply_markup: JSON.stringify({
            inline_keyboard: iKeys,
            parse_mode: 'Markdown'
        })
    };
    bot.sendMessage(user_id, data, options)
        .then(function(data) {
            wordsToday = [];
        })
        .catch(function(err) {
            console.log(err);
        });
}

function deleteWords(againSend = false) {
    fs.readFile('hello.txt', 'utf8', function(err, TEXTFILE) {
        if (err) {
            // check and handle err
        }
        var linesExceptFirst = TEXTFILE.split('\n').slice(11).join('\n');
        fs.writeFile("hello.txt", linesExceptFirst, function(error) {
            if (error) throw error; // если возникла ошибка
            console.log('данные успешно удалены');  // выводим считанные данные
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
    console.log('уже знаю')
    bot.sendMessage(user_id, 'Сейчас дам другие')
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
    bot.sendMessage(user_id, `Сейчас поменяю , привереда`)
        .then(function(data) {
            // console.log(util.inspect(data, false, null));
            deleteWords(true)
            return data;
        })
        .catch(function(err) {
            console.log(err);
        });
}
function good() {
    bot.sendMessage(user_id, `////////////ГОРЖУСЬ ТОБОЙ////////////
  ты выучила 5 слов из ${wordsLng - 5}
  ////////////ДО ЗАВТРА////////////
  `)
        .then(function(data) {
            // console.log(util.inspect(data, false, null));
            deleteWords()
        })
        .catch(function(err) {
            console.log(err);
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

        if (error) throw error; // если возникла ошибка


    });
}

