var debug = require('debug')('botkit:thread_settings');



module.exports = function(controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.thread_settings.greeting('Botkit bot has been conected!');
    controller.api.thread_settings.get_started('start_button_clicked');
    controller.api.thread_settings.menu([
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [    
                {
                    "type":"text",
                    "title":"Main menu",
                    "payload":"Main menu",
                    
                },
                {
                    "type":"text",
                    "title":"Shop",
                    "payload":"Shop"
                    
                }
            ]
        }]);        
}


