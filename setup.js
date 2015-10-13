require('dotenv').load();
var prompt = require('prompt');
var request = require('request');

prompt.start();

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
  //
  // Log the results.
  //
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