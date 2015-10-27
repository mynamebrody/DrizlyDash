![Drizly Dash](http://i.imgur.com/KbanITJ.png)
DrizlyDash
====
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bhberson/DrizlyDash?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

This is a node.js application that "hacks" your [Amazon Dash Button](http://www.amazon.com/dashbutton) to order you alcohol from [Drizly](https://www.drizly.com/)!
After my first app [PizzaDash](https://medium.com/@brody_berson/hacking-amazon-s-5-dash-button-to-order-domino-s-pizza-9d19c9d04646) ([source code](http://www.github.com/bhberson/pizzadash)) I felt like, what goes best with pizza? Simple answer, beer. So I set out to figure out how to get beer delivered to me, and in my area, there is Drizly who happens to have an API available to [developers](http://developers.drizly.com/).
I am using a npm module to listen for the button press [hortinstein](https://github.com/hortinstein)'s [Node-Dash-Button](https://github.com/hortinstein/node-dash-button).

One idea would be to have this [always running](#always-running) via a local server such as a Raspberry Pi and have on demand alcohol ordering whenever you just need a drink! ;)

Requirements
====
__pcap__
If you are running ubuntu you will need to run ` sudo apt-get install libpcap0.8-dev `

Contributing
====

1. Pull or Fork code.
2. Do cool stuff.
3. Submit a PR.

Setup/Run
====
1. Run ` npm install ` the first time so all npm requirements will be installed.
2. Find Dash Button
  - Run ` sudo node node_modules/node-dash-button/bin/findbutton ` and press the button
3. Run ` node accountCreation.js ` script to create a Drizly account under your unique partner token.
  - You need to create a new account using your unique partner token, even if you have already created one on Drizly's website
4. Run ` node setup.js ` script which will ask a few question to create a `.env` file to store your private information.
  - Add your Amazon Dash Button's address from step 2
  - Add your Partner Token that is handed out by [Drizly](http://developers.drizly.com/)
  - You will then log into your Drizly Account (If you haven't already created a Drizly account, please run `node accountCreation.js` and signup and _fill in your default address and credit card_.)
5. Rerun ` node setup.js ` script which will now ask you for a query to check out the catalog at your closest store.
  - See [Example Query](#example-query) for how to select your items
6. Currently right now you have to manually add your order to `app.js`
  - On ~ line 14/15 you can see `items[249325]` with the integer being a specific item which you can get by querying the catalog in the `setup.js` script right now. See [To do](#to-do) 
7. Run ` npm start ` and press your Dash Button that you have set up and BAM beer/wine/liquor will be coming soon!
 
Example Query
----
On step 5/6 Above where you need query the catalog and find what you want to order, here is an example output and how to select the correct item number: If you look underneath `variants: > availability: > item_id: 123456` That is the exact __item__ you need to choose for that specific store.

```bash
...
You are about to query Store: 92
DrizlyDash>Enter your alcohol query> sculpin

Command-line input received:
  query: sculpin

Query successful!  Server responded with:
[ { catalog_item_id: 810,
    name: 'Ballast Point Sculpin IPA',
    slug: 'ballast-point-sculpin-ipa',
    brand_name: 'Ballast Point',
    variants:
     [ { variant_id: 20054,
         display_name: 'Ballast Point Sculpin IPA 6 Cans',
         availability:
          [ { item_id: 515105,
              store_id: 92,
              quantity_on_hand: 54,
              price: '$14.49',
              price_raw: 14.49,
              show_in_catalog: true } ],
         container_qty: 6,
         container_type: 'Can',
         volume: 12,
         volume_units: 'OZ',
         short_description: '6 Cans' },
       { variant_id: 8744,
         display_name: 'Ballast Point Sculpin IPA 6 Bottles',
         availability:
          [ { item_id: 248290,
              store_id: 92,
              quantity_on_hand: 64,
              price: '$14.49',
              price_raw: 14.49,
              show_in_catalog: true } ],
         container_qty: 6,
         container_type: 'Bottle',
         volume: 12,
         volume_units: 'OZ',
         short_description: '6 Bottles' } ],
  ...
```

Always Running
----
This [article](http://weworkweplay.com/play/raspberry-pi-nodejs/) shows you what you can do with a [Raspberry Pi](https://www.raspberrypi.org/) to set this up as a node server running all the time on your network and it literally would be the press of a button *whenever* you wanted!

AWS IoT Button Version
----
Here is my small [Gist](https://gist.github.com/bhberson/ab99c5f53467b9b481c1) that is my AWS Lambda function that is fired off when pressing the Amazon [AWS IoT Button](http://aws.amazon.com/iot/button/). In my Medium article, I explain in depth how to use it.

To do
----
- Modify `setup.js` to allow user to create an order from queries to the catalog
- Create a localhost webpage that you can create account and search the catalog to build your order
- Other ideas?
