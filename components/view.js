

const Customer = require('./database/database')
const {viewProduct} =require('./shop.js');
const { to } = require('await-to-js');

const mainMenuButton = {
  'content_type': 'text',
  'title': 'Main menu',
  'payload': 'main_menu'
}
const Buybtn = {
  'content_type': 'text',
  'title': 'Buy',
  'payload': 'buy'
}

module.exports = function (bot, payloadMessage) {
 
  const message = payloadMessage
  const msgId = message.sender.id
  const payloadFavouriteSKU = message.payload.split(' ')[1]
  console.log(message);
  console.log(payloadFavouriteSKU);
  Customer.findOne({ messenger_id: `${msgId}` }).exec(async function (err, customer) {
    
    if (err) return console.log(err)
    if (!customer) {
      console.log(`No have customers with id ${msgId} in base.`)
      return bot.reply(message, {
        'text': `You have no customer's records in our base. To create a record add any product to favourites.`,
        'quick_replies': [mainMenuButton, Buybtn]
      })
    } else {
      if (!customer.favourites) {
        
       
        return bot.reply(message, {
          'text': `You have no products added to favourites. Add first to see someone.`,
          'quick_replies': [mainMenuButton, Buybtn]
        })
      } else {
        
        let data;
        [err,data] = await to (viewProduct(payloadFavouriteSKU));
        if(err) console.log(err);
        if(data) console.log(data);
        let obj = {
          "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[]
          }
        }
          for(let i in data) {
            let cardProd =
                 {
                  "title":`${data[i].name}`,
                  "image_url":`${data[i].image}`,
                  "subtitle":`${data[i].plot}`,
                  "default_action": {
                    "type": "web_url",
                    "url": "https://google.com",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url":`${data[i].image}` 
                  },
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Buy",
                      "payload":`Buy ${data[i].sku} ${data[i].salePrice}`,
                      
                    },
                    {
                      "type":"postback",
                      "title":"Return",
                      "payload":"Return"
                    }              
                  ]      
               
          }
        
          obj.payload.elements.push(cardProd);
        }
        console.log(JSON.stringify(obj,null,'  '));
          bot.reply(message, {attachment: obj});
          bot.startConversation(message, function(err, convo) {
            convo.say({
                text: '',
                quick_replies: 
                [{
                  content_type: 'text',
                  title: 'Return',
                  payload: 'Return',
                }]
              });
        });
    }};
  });
}