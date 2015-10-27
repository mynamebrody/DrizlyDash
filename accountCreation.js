var prompt = require('prompt'),
    request = require('request'),
    prettyjson = require('prettyjson');

var baseURL, partnerToken, userToken, userid, addressid, creditcardid;

console.log('DrizlyDash Account Creation Script\n');
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
    name: 'first',
    description: 'Enter your First Name',
    required: true
}, {
    name: 'last',
    description: 'Enter your Last Name',
    required: true
}, {
    name: 'bday',
    description: 'Enter your birthday (YYYY-MM-DD)',
    required: true
}, {
    name: 'email',
    description: 'Enter your Drizly email',
    required: true
}, {
    name: 'password',
    description: 'Enter your Drizly password',
    hidden: true,
    conform: function(value) {
        return true;
    }
}], function(err, result) {
    console.log('Command-line input received:');
    console.log('  base url: ' + result.url);
    console.log('  name: ' + result.first + ' ' + result.last);
    console.log('  birthday: ' + result.bday);
    console.log('  email: ' + result.email);
    console.log('  password: ********');

    baseURL = result.url;
    partnerToken = result.partner;

    var endpoint = baseURL + '/user/new';

    var formData = {
        partner_token: partnerToken,
        email: result.email,
        password: result.password,
        birth_date: result.bday,
        first_name: result.first,
        last_name: result.last
    };
    request.post({
        url: endpoint,
        formData: formData
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('\nAccount Creation failed:', err);
        }
        var jsonBody = JSON.parse(body),
            jsonOptions = {
                keysColor: 'magenta',
                dashColor: 'red',
                stringColor: 'white',
                numberColor: 'green'
            };
        console.log('\nAccount Creation successful!  Server responded with: \n', prettyjson.render(jsonBody, jsonOptions));
        userToken = jsonBody.token.token;
        userid = ''+jsonBody.token.user_id;

    });

    setTimeout(function() {
        console.log('Please enter your delivery address and then consult the braintree documentation\nfor more information on how to tokenize credit cards to get a payment method nonce.\nhttps://developers.braintreepayments.com');
        prompt.get([{
            name: 'first',
            description: 'Enter your First Name',
            required: true
        }, {
            name: 'last',
            description: 'Enter your Last Name',
            required: true
        }, {
            name: 'company',
            description: 'Enter your Company Name (optional)'
        }, {
            name: 'address1',
            description: 'Enter your Address Line 1',
            required: true
        }, {
            name: 'address2',
            description: 'Enter your Address Line 2 (optional)'
        }, {
            name: 'city',
            description: 'Enter your City',
            required: true
        }, {
            name: 'state',
            description: 'Enter your State (XY)',
            required: true
        }, {
            name: 'zip',
            description: 'Enter your 5 Digit Zip Code',
            required: true
        }, {
            name: 'phone',
            description: 'Enter your 10 Digit Phone Number without dashes',
            required: true
        }, {
            name: 'cardholder_name',
            description: 'Enter the Credit Card Holder\'s Name',
            required: true
        }, {
            name: 'payment_method_nonce',
            description: 'Enter the Brain Tree payment method nounce',
            required: true
        }, {
            name: 'billing_zip',
            description: 'Enter the Credit Card 5 digit zip code',
            required: true
        }], function(err, result) {

            var endpoint = baseURL + '/user/' + userid + '/addresses/new';

            var formData = {
                partner_token: partnerToken,
                token: userToken,
                first_name: result.first,
                last_name: result.last,
                company: result.company,
                address1: result.address1,
                address2: result.address2,
                city: result.city,
                state: result.state,
                zip: result.zip,
                phone: result.phone,
                is_default: 'true'
            };
            request.post({
                url: endpoint,
                formData: formData
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('\nAddress Creation failed:', err);
                }
                var jsonBody = JSON.parse(body),
                    jsonOptions = {
                        keysColor: 'magenta',
                        dashColor: 'red',
                        stringColor: 'white',
                        numberColor: 'green'
                    };
                console.log('\nAddress Creation successful!  Server responded with: \n', prettyjson.render(jsonBody, jsonOptions));
                addressid = jsonBody.address.address_id;

                endpoint = baseURL + '/user/' + userid + '/credit_cards/new';

                formData = {
                    partner_token: partnerToken,
                    token: userToken,
                    cardholder_name: result.cardholder_name,
                    payment_method_nonce: result.payment_method_nonce,
                    billing_zip: result.billing_zip,
                    is_default: 'true'
                };
                request.post({
                    url: endpoint,
                    formData: formData
                }, function optionalCallback(err, httpResponse, body) {
                    if (err) {
                        return console.error('\nCredit Card Creation failed:', err);
                    }
                    var jsonBody = JSON.parse(body),
                        jsonOptions = {
                            keysColor: 'magenta',
                            dashColor: 'red',
                            stringColor: 'white',
                            numberColor: 'green'
                        };
                    console.log('\nCredit Card Creation successful!  Server responded with: \n', prettyjson.render(jsonBody, jsonOptions));
                    creditcardid = jsonBody.saved_credit_card.saved_credit_card_id;
                });
            });

        });
    }, 3000);
});


function onErr(err) {
    console.log(err);
    return 1;
}