![Drizly Dash](http://i.imgur.com/KbanITJ.png)
DrizlyDash
====
This is a node.js application that "hacks" your [Amazon Dash Button](http://www.amazon.com/dashbutton) to order you alcohol from [Drizly](https://www.drizly.com/)!
After my first app [PizzaDash](https://medium.com/@brody_berson/hacking-amazon-s-5-dash-button-to-order-domino-s-pizza-9d19c9d04646) I felt like, what goes best with pizza? Simple answer, beer. So I set out to figure out how to get beer delivered to me, and in my area, there is Drizly who happens to have an API available to [developers](http://developers.drizly.com/).
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
3. Find Dash Button
  - Run ` sudo node node_modules/node-dash-button/bin/findbutton ` and press the button
4. Run `node setup.js` script.
  - Add your Amazon Dash Button's address from step 3
  - Add your Partner Token that is handed out by [Drizly](http://developers.drizly.com/)
  - You will then log into your Drizly Account (If you haven't already created a Drizly account, please go to https://drizly.com/session/register and signup and _fill in your default address and credit card_.)
5. Run` npm start ` and press your Dash Button that you have set up and BAM beer/wine/liquor will be coming soon!

Always Running
----
This [article](http://weworkweplay.com/play/raspberry-pi-nodejs/) shows you what you can do with a [Raspberry Pi](https://www.raspberrypi.org/) to set this up as a node server running all the time on your network and it literally would be the press of a button *whenever* you wanted!

To do
----
- Smooth things out and make a setup script for first time users that will create an `app.js` file automatically for them
- Other ideas?
