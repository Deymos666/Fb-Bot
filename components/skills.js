  const {findProduct} = require("./shop.js");
  const { to } = require('await-to-js');
  const {showFav} =require('./shop.js');
  const Customer = require('./database/database');
  const messengerLink = process.env.ref_link
  const mainMenuButton = {
    'content_type': 'text',
    'title': 'Main menu',
    'payload': 'Main menu'
  }


module.exports = function(controller) {

    var bot = controller.spawn({
    });

    controller.on('facebook_postback, message_received', function(bot, message) {

        if (message.payload == 'start_button_clicked' || message.payload == 'Начать') {
          
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
                    payload: 'my_puchares',
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


  controller.hears(["Shop","Catalog"],'facebook_postback,message_received', async function(bot, message) {

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
//referal programm

controller.hears(['Yes','To invite a friend'], 'message_received,facebook_postback', function(bot, message) {  
const msgId = message.sender.id
console.log(message);
Customer.findOne({ messenger_id: `${msgId}` }).exec(function (err, customer) {
  err? console.log(err): null;
  if (!customer) {
    Customer.create({ messenger_id: `${msgId}`, invitations: [] })
    console.log(`New customer was successfully added to base.`)
    bot.reply(message, {
      'text': `Your link for friends ${messengerLink}?ref=${msgId}\nShare with 3 friends and get 1 free product`,
      'quick_replies': [{
        content_type: 'text',
        title: 'My purchases',
        payload: 'my_puchares',
      },
      {
        content_type: 'text',
        title: 'Shop',
        payload: 'shop',
      }]
    })
  } else {
    if (!customer.invitations.length) {
      customer.invitations = []
      customer.save(function (err) {
        if (err) console.log(err)
        console.log(`Customers invitations were successfully created with [].`)
        bot.reply(message, {
          'text': `Share with 3 friends and get 1 free product  ${messengerLink}?ref=${msgId}\n`,
          'quick_replies': [{
            content_type: 'text',
            title: 'My purchases',
            payload: 'my_puchares',
          },
          {
            content_type: 'text',
            title: 'Shop',
            payload: 'shop',
          }]
        })
      })
    } else {
      bot.reply(message, {
        'text': `Your link for friends  ${messengerLink}?ref=${msgId}\nShare with 3 friends and get 1 free product`,
        'quick_replies': [{
          content_type: 'text',
          title: 'My purchases',
          payload: 'my_puchares',
        },
        {
          content_type: 'text',
          title: 'Shop',
          payload: 'shop',
        }]
      })
    }
  }
})
if (ref !== msgId) {
  Customer.findOne({ messenger_id: `${ref}` }).exec(function (err, customer) {
    if (err) return console.log(err)
    if (!customer) {
      console.log(`No have customers with id ${ref} in base. Bad REF in link`)
    } else {
      if (!~customer.invitations.indexOf(msgId)) {
        customer.invitations.push(msgId)
        customer.save(function (err) {
          if (err) console.log(err)
          console.log(`Customers ${ref} invitations were successfully updated.`)
          bot.say(
            {
              text: `${messengerLink}?ref=${ref} is activated by user ${msgId}`,
              channel: `${ref}`
            }
          )
          if (customer.invitations !== 0 && customer.invitations.length % 3 === 0) {
            bot.say(
              {
                text: `You have collected 3 activated invitations. Now you can get 1 free product in our store.`,
                channel: `${ref}`
              })
          }
        })
      }
    }
  })
}
});







//BUY PRODUCTS ***********************
controller.hears(['buy'], 'message_received,facebook_postback', function(bot, message) {

  bot.startConversation(message, function(err, convo) {

      convo.ask({
        text: 'Write your phone',
        quick_replies: 
      [{
        content_type: "user_phone_number",
        title: 'Number',
         payload: 'user_number',
     }
    ]
  },function(response, convo) {
    console.log(JSON.stringify(response,null,'  ')); //Create number save

    // let test = "???//////?????";
    let msgId = message.sender.id
    let user_number = response.quick_reply.payload.toString("");
    let favSku = message.postback.payload.split(' ')[1];
    console.log(favSku,"12899999999999989879*******(!************8");
    Customer.updateOne({messenger_id:`${msgId}`},{
       $set: { coordinates: `${user_number}`,"coordinates.sku":`${favSku}` },
   
    },function(err,resp){
      if(err){
        console.log(err)
      }else{
        console.log(resp);
      }
    });
    
    // console.log(user_number + " Phone ******************************************************");
                                          convo.next();
          
      });
      convo.ask({
        text: 'Write your location',
        quick_replies: 
      [{
        content_type: "location",
        title: 'location',
         payload: 'location',
     }
    ]
  }, function(response,convo) {
    console.log(JSON.stringify(response,null,'  '));    //Create location data

    let msgId = message.sender.id
    let Lat = response.attachments[0].payload.coordinates.lat
    let Long = response.attachments[0].payload.coordinates.long
    //save date
    let date = new Date();
    let curr_date = date.getDate();
    let curr_month = date.getMonth() + 1;
    let curr_year = date.getFullYear();
    let curr_day = date.getDay() + 1;
    let curr_hours = date.getHours();
    let curr_minutes = date.getMinutes();

    Customer.updateOne({messenger_id:`${msgId}`},{
      $set: { "coordinates.latitude": `${Lat}`,"coordinates.longitude": `${Long}`,"coordinates.date":`${curr_date + curr_month+  "/" +curr_year+ "/" + + curr_day +  " " + curr_hours + ":" + curr_minutes}` },
   },function(err,resp){
     if(err){
       console.log(err)
     }else{
      console.log(Lat , Long + " Location******************************************************");
     }
   });


   
    
    
  
                                            convo.next();


    convo.ask({
      text: 'A courier will contact you in 15 minutes, Thank for pushares',
      quick_replies: 
    [{
      content_type: "text",
      title: 'My purchases',
       payload: 'my_puchares',
   }
  ]
      });
                                           convo.next(); 
                     
      
    });
  });
});

controller.hears(["My purchases"],'facebook_postback,message_received',  function(bot, message) {
    const msgId = message.sender.id;
    Customer.findOne({ messenger_id: `${msgId}` }).exec(function (err, customer) {
      const pucharesSku = customer.coordinates.sku 
      const pucharesDate = customer.coordinates.date;
      console.log('Data puchares; ' + pucharesDate);
        console.log('Sku puchares ' + pucharesSku);
        console.log("User ID " + msgId);
        let obj = {
          "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[]
          }
        }
            let element =
                 {
                  "title":`${pucharesDate}`,
                  "image_url":``,
                  "subtitle":`${pucharesSku}`,
                  "default_action": {
                    "type": "web_url",
                    "url": "https://google.com",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url":`` 
                  },
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"Return",
                      "payload":"Return",
                      
                    }            
                  ]      
               
          }
        
          obj.payload.elements.push(element);
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
        
    })
  
    
    
    
});









}







    
