  const {findProduct} = require("./shop")
  const { to } = require('await-to-js');

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



    controller.hears(["No"],'facebook_postback, message_received', function(bot, message) {

          bot.startConversation(message, function(err, convo) {
              convo.say({
                  text: 'MAIN MENU',
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
    [err, data] = await to (findProduct());
    console.log('data result =' + JSON.stringify(data));
    if(err){
        return console.log(err);
    }
    console.log(JSON.stringify("asdasd" + data));


    let obj = {
      "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[]
      }
    }

    
      for(let i in data) {
        let element =
             {
              "title":`${data[i].name}`,
              "image_url":`${data[i].image}`,
              "subtitle":`${data[i].sku}`,
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
                  "title":"Read More",
                  "payload":"Read More"
                },{
                  "type":"postback",
                  "title":"Start Chatting",
                  "payload":"DEVELOPER_DEFINED_PAYLOAD"
                }              
              ]      
      }
     
      obj.payload.elements.push(element);
    }
    console.log(JSON.stringify(obj,null,'  '));
      bot.reply(message, {attachment: obj});
  });




  controller.hears(["Read More"],'facebook_postback,message_received', function(bot, message) {
      



  });
  
};
