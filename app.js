require('dotenv').load();
var request = require('request'),
    dash_button = require('node-dash-button'),
    prettyjson = require('prettyjson');

//Drizly Logic
var dash = dash_button(process.env.DASH_MAC_ADDRESS),
    endpoint = process.env.URL + '/checkout/process',
    formData = {
        partner_token: process.env.PARTNER_TOKEN,
        token: process.env.TOKEN,
        delivery_address_id: process.env.ADDRESS_ID,
        saved_credit_card_id: process.env.CREDIT_CARD_ID,
        'delivery_location[latitude]': process.env.LATITUDE,
        'delivery_location[longitude]': process.env.LONGITUDE,
        'items[249325]': 1,
        'items[515105]': 1,
        order_comment: 'This was ordered via Amazon Dash Button'
    };

dash.on("detected", function (){
    console.log("Dash Button Found");
	//Validate, price, and place order!
	request.post({url: endpoint, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('Checkout failed:', err);
        }
        console.log('Checkout successful!  Server responded with: \n', prettyjson.render(JSON.parse(body), {
          keysColor: 'magenta',
          dashColor: 'red',
          stringColor: 'white',
          numberColor: 'green'
        }));
    });
});