require('dotenv').load();
var prompt = require('prompt');
var request = require('request');
var baseURL = 'https://sandbox.drizly.com/api/v3';
var partnerToken, userToken, userid, addressid, creditcardid, lon, lat, storeid;

prompt.message = 'DrizlyDash Setup Script\nIf you haven\'t already created a Drizly account, please go to https://drizly.com/session/register\nand signup and fill in your default address and credit card.\n'.red;
prompt.delimiter = ">".cyan;

prompt.start();

// Login
prompt.get([{
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
  console.log('  email: ' + result.email);
  console.log('  password: ********');

  partnerToken = result.partner;

  var endpoint = baseURL + '/user/authenticate';

  var formData = {
    partner_token: partnerToken,
    email: result.email,
    password: result.password
  };
  request.post({url: endpoint, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('Login failed:', err);
    }
    console.log('Login successful!  Server responded with: \n', JSON.parse(body));
    userToken = JSON.parse(body).token.token;
    userid = JSON.parse(body).token.user_id;
    addressid = JSON.parse(body).user.default_delivery_address.address_id;
    creditcardid = JSON.parse(body).user.default_saved_credit_card.saved_credit_card_id;
  });
});

// Get Lat/Long
prompt.get([{
  name:'address',
  description: 'Enter your address'
  }], function (err, result) {
  console.log('Command-line input received:');
  console.log('  address: ' + result.address);
  var geocoderProvider = 'openstreetmap';
  var httpAdapter = 'https';
  var extra = {
      language: 'English',
      email: 'brody.berson@gmail.com',
      formatter: null
  };
  var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
   
  geocoder.geocode(result.address, function(err, res) {
      console.log(res);
      lat = res[0].latitude;
      lon = res[0].longitude;
      var endpoint = baseURL + '/store/resolve?partner_token=' + partnerToken + '&token=' + userToken + '&latitude=' + lat + '&longitude=' + lon;
      request(endpoint, function (err, response, body) {
        if (err) {
          return console.error('Store Lookup failed:', err);
        }
        console.log('Store lookup successful!  Server responded with: \n', JSON.parse(body).stores[0]);
        storeid = JSON.parse(body).stores[0].id;
      });
  });
});

// Query Store
prompt.get([{
  name:'query',
  description: 'Enter your alcohol query'
  }], function (err, result) {
  console.log('Command-line input received:');
  console.log('  query: ' + result.query);

  var endpoint = baseURL + '/catalog/filter?partner_token=' + partnerToken + '&token=' + userToken + '&per_page=100&store_id=' + storeid + '&q=' + result.query;

  request(endpoint, function (err, response, body) {
    if (err) {
      return console.error('Query failed:', err);
    }
    console.log('Query successful!  Server responded with: \n', JSON.parse(body).catalog_items);
  });
});

function onErr(err) {
    console.log(err);
    return 1;
}