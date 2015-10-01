var dash_button = require('node-dash-button');

//Drizly Logic

var dash = dash_button("XX:02:dc:85:b8:3c"); //MAC Address
dash.on("detected", function (){
    console.log("Dash Button Found");
	//Validate, price, and place order!
	
});