const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '547699301:AAHc4Ml2BvZDHruy3LA4wpK_fJOhXmMwqoQ';

const bot= new TelegramBot(TOKEN , {
    polling:true,
    updates: {
        enabled: true
    },
})

bot.on('message' , msg =>{
    fs.readFile("hello.txt", "utf8",
    function (error, data) {
      console.log('ok')
      if (error) throw error;
      data = data.replace(/\t/g, '').replace(/<br>/g, '\n');
      wordsLng = data.split('\n').length;
      data = data.split('\n').slice(0, 5);
      data = data.join('\n').toString();
      TEXT = data;
  //546579876 644045807
       sendWordsToday(data);
       log(4)
    });
})

fs.readFile("hello.txt", "utf8",
  function (error, data) {
    console.log('ok')
    if (error) throw error;
    data = data.replace(/\t/g, '').replace(/<br>/g, '\n');
    wordsLng = data.split('\n').length;
    data = data.split('\n').slice(0, 5);
    data = data.join('\n').toString();
    TEXT = data;
//546579876 644045807
     sendWordsToday(data);
     log(4)
  });

  bot.on('inline.callback.query', function (msg) {

    var data = msg.data;
    if(data == '1') {good();log(1)}
    else if(data == '2') { noIntresting();log(2)}
    else {INow();log(3)}
    console.log(TEXT)
  });


function sendWordsToday(data){
    bot.sendMessage({
      chat_id: user_id,
      text: data,
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: 'выучила',
              callback_data: '1'
            },
          ],
          [
            {
              text: 'ненужные слова',
              callback_data: '2'
            },
            {
              text: 'уже знаю',
              callback_data: '3'
            }
          ]
        ]
      })
    })
      .then(function (data) {
        // console.log(util.inspect(data, false, null));
        wordsToday = [];
      })
      .catch(function (err) {
        console.log(err);
      });
  }


function log(action){
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
    fs.appendFile("log.txt", log, function (error) {
  
      if (error) throw error; // если возникла ошибка
     
      
    });
  }
  
  