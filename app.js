require('dotenv').load();
var dash_button = require('node-dash-button');

//Drizly Logic

var dash = dash_button(process.env.DASH_MAC_ADDRESS);
dash.on("detected", function (){
    console.log("Dash Button Found");
	//Validate, price, and place order!
	
});