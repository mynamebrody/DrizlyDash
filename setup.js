var dotenv = require('dotenv').load({silent: true}),
  prompt = require('prompt'),
  request = require('request'),
  util = require('util');

if (dotenv == false){
  var dashButton, baseURL, partnerToken, userToken, userid, addressid, creditcardid, lon, lat, storeid;

  console.log('DrizlyDash Setup Script\nIf you haven\'t already created a Drizly account, please go to https://drizly.com/session/register\nand signup and fill in your default address and credit card.\n');
  prompt.message = 'DrizlyDash'.red;
  prompt.delimiter = ">".cyan;

  prompt.start();

  // Login
  prompt.get([{
      name: 'dash',
      description: 'Enter the Dash Button MAC',
      required: true
    }, {
      name: 'url',
      description: 'Enter the Drizly API URL',
      required: true
    }, {
      name: 'partner',
      description: 'Enter your Drizly API Partner Token',
      required: true
    }, {
      name: 'email',
      description: 'Enter your Drizly email',
      required: true
    }, {
      name: 'password',
      description: 'Enter your Drizly password',
      hidden: true,
      conform: function (value) {
        return true;
      }
    }], function (err, result) {
    console.log('Command-line input received:');
    console.log('  dash button: ' + result.dash);
    console.log('  base url: ' + result.url);
    console.log('  email: ' + result.email);
    console.log('  password: ********');

    dashButton = result.dash;
    baseURL = result.url;
    partnerToken = result.partner;

    var endpoint = baseURL + '/user/authenticate';

    var formData = {
      partner_token: partnerToken,
      email: result.email,
      password: result.password
    };
    request.post({url: endpoint, formData: formData}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('\nLogin failed:', err);
      }
      var jsonBody = JSON.parse(body);
      console.log('\nLogin successful!  Server responded with: \n', jsonBody);
      userToken = jsonBody.token.token;
      userid = jsonBody.token.user_id;
      addressid = jsonBody.user.default_delivery_address.address_id;
      creditcardid = jsonBody.user.default_saved_credit_card.saved_credit_card_id;

      // Find Closest Store
      lat = jsonBody.user.default_delivery_address.latitude;
      lon = jsonBody.user.default_delivery_address.longitude;
      endpoint = baseURL + '/store/resolve?partner_token=' + partnerToken + '&token=' + userToken + '&latitude=' + lat + '&longitude=' + lon;
      request(endpoint, function (err, response, body) {
        if (err) {
          return console.error('\nStore Lookup failed:', err);
        }
        jsonBody = JSON.parse(body);
        console.log('\nStore lookup successful!  Server responded with: \n', jsonBody.stores[0]);
        storeid = jsonBody.stores[0].id;

        var fs = require('fs');
        var data = 'DASH_MAC_ADDRESS='+dashButton+'\nURL='+baseURL+'\nPARTNER_TOKEN='+partnerToken+'\nTOKEN='+userToken+'\nUSER_ID='+userid+'\nADDRESS_ID='+addressid+'\nCREDIT_CARD_ID='+creditcardid+'\nLATITUDE='+lat+'\nLONGITUDE='+lon+'\nSTORE_ID='+storeid;
        fs.writeFile('.env', data, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!\nPlease rerun this script to query the Drizly Database for your closest store.");
        }); 
      });
    });
  });


  function onErr(err) {
      console.log(err);
      return 1;
  }
} else {
  console.log('DrizlyDash Setup Script\nIf you are looking for the .env file setup, please execute:\nrm .env\nand restart this script.\nOtherwise you are about to query Store: ' + process.env.STORE_ID);
  prompt.message = 'DrizlyDash'.red;
  prompt.delimiter = ">".green;

  prompt.start();

  // Login
  prompt.get([{
      name:'query',
      description: 'Enter your alcohol query'
    }], function (err, result) {
    console.log('Command-line input received:');
    console.log('  query: ' + result.query);
    var endpoint = process.env.URL + '/catalog/filter?partner_token=' + process.env.PARTNER_TOKEN + '&token=' + process.env.TOKEN + '&per_page=100&store_id=' + process.env.STORE_ID + '&q=' + result.query;

    request(endpoint, function (err, response, body) {
      if (err) {
        return console.error('\nQuery failed:', err);
      }
      console.log('\nQuery successful!  Server responded with: \n', util.inspect(JSON.parse(body).catalog_items, false, null));
    });
  });


  function onErr(err) {
      console.log(err);
      return 1;
  }
}