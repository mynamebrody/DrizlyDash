require('dotenv').load();
var prompt = require('prompt');
var request = require('request');

prompt.start();

// Login
prompt.get([{
    name: 'email',
    required: true
  }, {
    name: 'password',
    hidden: true,
    conform: function (value) {
      return true;
    }
  }], function (err, result) {
  console.log('Command-line input received:');
  console.log('  email: ' + result.email);
  console.log('  password: ' + result.password);

  var endpoint = process.env.URL + '/user/authenticate';

  var formData = {
    partner_token: process.env.PARTNER_TOKEN,
    email: result.email,
    password: result.password
  };
  request.post({url: endpoint, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('Login failed:', err);
    }
    console.log('Login successful!  Server responded with: \n', JSON.parse(body));
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
  });
});


// Query Store
prompt.get([{
  name:'query',
  description: 'Enter your alcohol query'
  }], function (err, result) {
  console.log('Command-line input received:');
  console.log('  query: ' + result.query);

  var endpoint = process.env.URL + '/catalog/filter?partner_token=' + process.env.PARTNER_TOKEN + '&token=' + process.env.TOKEN + '&store_id=92&q=' + result.query;

  request.get(endpoint).on('response', function(response) {
    console.log(response);
  });
});

function onErr(err) {
    console.log(err);
    return 1;
}