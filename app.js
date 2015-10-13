require('dotenv').load();
var request = require('request');
var dash_button = require('node-dash-button');

//Drizly Logic
var endpointCheckout = process.env.URL + '/checkout/process';
var formDataCheckout = {
    partner_token: process.env.PARTNER_TOKEN,
    token: process.env.TOKEN,
    delivery_address_id: process.env.ADDRESS_ID,
    saved_credit_card_id: process.end.CREDIT_CARD_ID,
    items[249325]: 1,
    items[515105]: 1,
    order_comment: 'This was ordered via Amazon Dash Button'
};

var dash = dash_button(process.env.DASH_MAC_ADDRESS);
dash.on("detected", function (){
    console.log("Dash Button Found");
	//Validate, price, and place order!
	request.post({url: endpointCheckout, formData: formDataCheckout}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('Checkout failed:', err);
        }
        console.log('Checkout successful!  Server responded with: \n', JSON.parse(body));
    });
});