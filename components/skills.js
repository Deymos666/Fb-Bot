  const {findProduct} = require("./shop.js");
  const { to } = require('await-to-js');
  const {showFav} =require('./shop.js');





module.exports = function(controller) {

    var bot = controller.spawn({
    });

    controller.on('facebook_postback, message_received', function(bot, message) {

        if (message.payload == 'start_button_clicked' || message.payload == 'main_menu') {
          
            bot.startConversation(message, function(err, convo) {
                convo.say({
                    text: 'Hello, Open ref link ? ',
                    quick_replies: 
                    [{
                      content_type: 'text',
                      title: 'Yes',
                      payload: 'Yes',
                    },
                    {
                      content_type: 'text',
                      title: 'No',
                      payload: 'No',
                    }]
                  });
            });
        }
    })



    controller.hears(["No","Return","Main menu"],'facebook_postback, message_received', function(bot, message) {

          bot.startConversation(message, function(err, convo) {
              convo.say({
                  text: 'Main menu',
                  quick_replies: 
                  [{
                    content_type: 'text',
                    title: 'My purchases',
                    payload: 'purchases',
                  },
                  {
                    content_type: 'text',
                    title: 'Shop',
                    payload: 'shop',
                  },
                  {
                    content_type: 'text',
                    title: 'Favourites',
                    payload: 'favourites',
                  },
                  {
                    content_type: 'text',
                    title: 'To invite a friend',
                    payload: 'invitation',
                  }]
                });
          });
  })


  controller.hears(["Shop"],'facebook_postback,message_received', async function(bot, message) {

    [err,products] = await to (findProduct("Movie"));
    console.log('data result =' + JSON.stringify(products));
    if(err){
        return console.log(err);
    }

    let obj = {
      "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[]
      }
    }
      for(let product of products) {
        let element =
             {
              "title":`${product.name}`,
              "image_url":`${product.image}`,
              "subtitle":`${product.sku}`,
              "default_action": {
                "type": "web_url",
                "url": "https://google.com",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url":`${product.image}` 
              },
              "buttons":[
                {
                  "type":"postback",
                  "title":"Add to favorites",
                  "payload":"add_to_favourites" + `${product.sku}`,
                  
                },
                {
                  'type': 'postback',
                  'title': 'View more',
                  'payload': `view_more ${product.sku}`
                },
                {
                  "type":"postback",
                  "title":"Return",
                  "payload":"Return"
                }              
              ]      
           
      }
    
      obj.payload.elements.push(element);
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

  });



  controller.on('facebook_postback', function (bot, message) {
    if (typeof (message.payload) === 'string' && ~message.payload.indexOf('add_to_favourites')) {
      require('./favourites.js')(bot, message)
      console.log("Its a favorites");
    }
  })

  controller.on('facebook_postback', function (bot, message) {
    if (typeof (message.payload) === 'string' && ~message.payload.indexOf('buy')) {
      require('./favourites.js')(bot, message)
      console.log("Its a Buy process");
    }
  })

  controller.on('facebook_postback', function (bot, message) {
    if (typeof (message.payload) === 'string' && ~message.payload.indexOf('view_more')) {
      require('./view.js')(bot, message)
      console.log("Its a view");
    }
  })

  


  controller.on('message_received', function (bot, message) {
    if (message.quick_reply) {
      if (message.quick_reply.payload === 'favourites') {
        require('./push_favorites.js')(bot, message)
      }
    }
  })


  // controller.hears(["Favourites"],'facebook_postback,message_received', async function(bot, message) {
  //   // const arrFavorites ='10158697,10158697,10158697,10158697,10158697';
  //   // let err,data;
  //   // [err,data] = await to (showFav(arrFavorites));
  //   // console.log('data result =' + JSON.stringify(data));
  //   // if(err){
  //   //     return console.log(err);
  //   // }

  //   // let obj = {
  //   //   "type":"template",
  //   //       "payload":{
  //   //         "template_type":"generic",
  //   //         "elements":[]
  //   //   }
  //   // }

    
  //   //   for(let i in data) {
  //   //     let pusher =
  //   //          {
  //   //           "title":`${data[i].name}`,
  //   //           "image_url":`${data[i].image}`,
  //   //           "subtitle":`${data[i].sku}`,
  //   //           "default_action": {
  //   //             "type": "web_url",
  //   //             "url": "https://google.com",
  //   //             "messenger_extensions": true,
  //   //             "webview_height_ratio": "tall",
  //   //             "fallback_url":`${data[i].image}` 
  //   //           },
  //   //           "buttons":[
  //   //             {
  //   //               "type":"postback",
  //   //               "title":"Add to favorites",
  //   //               "payload":"add_to_favourites" + `${data[i].salePrice}`,
                  
  //   //             },
  //   //             {
  //   //               "type":"postback",
  //   //               "title":"View More",
  //   //               "payload":"More"
  //   //             },
  //   //             {
  //   //               "type":"postback",
  //   //               "title":"Return",
  //   //               "payload":"Return"
  //   //             }              
  //   //           ]      
           
  //   //   }
    
  //   //   obj.payload.elements.push(pusher);
  //   // }
  //   // console.log(JSON.stringify(obj,null,'  '));
  //   //   bot.reply(message, {attachment: obj});
  //   //   bot.startConversation(message, function(err, convo) {
  //   //     convo.say({
  //   //         text: '',
  //   //         quick_replies: 
  //   //         [{
  //   //           content_type: 'text',
  //   //           title: 'Return',
  //   //           payload: 'Return',
  //   //         }]
  //   //       });
  //   // });

  // });

  
  


  







controller.hears(["My purchases"],'facebook_postback, message_received', function(bot, message) {
  
  bot.startConversation(message, function(err, convo) {
    convo.say({
        text: 'My purchases',
        quick_replies: 
        [{
          content_type: 'text',
          title: 'Return',
          payload: 'Return',
        }]
      });
    });
  })

};



