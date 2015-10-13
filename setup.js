var prompt = require('prompt');
var request = require('request');
var baseURL, partnerToken, userToken, userid, addressid, creditcardid, lon, lat, storeid;

console.log('DrizlyDash Setup Script\nIf you haven\'t already created a Drizly account, please go to https://drizly.com/session/register\nand signup and fill in your default address and credit card.\n');
prompt.message = 'DrizlyDash'.red;
prompt.delimiter = ">".cyan;

prompt.start();

// Login
prompt.get([{
    name: 'partner',
    description: 'Enter your Drizly API Partner Token',
    required: true
  }, {
    name: 'url',
    description: 'Enter the Drizly API URL',
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
  },{
    name:'query',
    description: 'Enter your alcohol query'
  }], function (err, result) {
  console.log('Command-line input received:');
  console.log('  email: ' + result.url);
  console.log('  email: ' + result.email);
  console.log('  password: ********');

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
      var jsonBody = JSON.parse(body);
      console.log('\nStore lookup successful!  Server responded with: \n', jsonBody.stores[0]);
      storeid = jsonBody.stores[0].id;
      // Query Store
      console.log('\n  query: ' + result.query);
      endpoint = baseURL + '/catalog/filter?partner_token=' + partnerToken + '&token=' + userToken + '&per_page=100&store_id=' + storeid + '&q=' + result.query;

      request(endpoint, function (err, response, body) {
        if (err) {
          return console.error('\nQuery failed:', err);
        }
        console.log('\nQuery successful!  Server responded with: \n', JSON.parse(body).catalog_items);
      });

      var fs = require('fs');
      var data = 'DASH_MAC_ADDRESS=XX:yy:zz:11:22:33\nURL='+baseURL+'\nPARTNER_TOKEN='+partnerToken+'\nTOKEN='+userToken+'\nUSER_ID='+userid+'\nADDRESS_ID='+addressid+'\nCREDIT_CARD_ID='+creditcardid+'\nLATITUDE='+lat+'\nLONGITUDE='+lon+'\nSTORE_ID='+storeid;
      fs.writeFile('example.env', data, function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
      }); 
    });
  });
});


function onErr(err) {
    console.log(err);
    return 1;
}