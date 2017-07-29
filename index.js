const blessed = require('blessed');
const fetch = require('node-fetch');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const screen = blessed.screen({
  smartCSR: true
});

// Add ticker box
const tickerBox = blessed.box({
  top: 0,
  left: 0,
  width: '50%',
  height: '50%',
  border: {
    type: 'line'
  },

  label: 'Ticker',
  content: 'Hello'
});

screen.append(tickerBox);

var count = 0;
function getTicker() {
  fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
    .then(res => res.json())
    .then(body => {
      tickerBox.setContent('ETH: $' + body[0]['price_usd']);
      tickerBox.insertLine(1, 'Last updated: ' + body[0]['last_updated']);
      tickerBox.insertLine(2, '' + count);
      count = count + 1;

      screen.render();
    });
}

getTicker();
setTimeout(() => {
  getTicker();

}, 5000);

// Add network stats box
const networkBox = blessed.box({
  top: 0,
  left: '50%',
  width: '50%',
  height: '50%',
  border: {
    type: 'line'
  },

  label: 'Network',
  content: 'over here'
});
var filter = web3.eth.filter('latest');

filter.watch(function(error, result){
  var block = web3.eth.getBlock(result, true);
  networkBox.setContent('current block #' + block.number);
  networkBox.insertLine(1, 'timestamp: ' + block.timestamp);

  screen.render();
});

screen.append(networkBox);

// Portfolio
const portfolioBox = blessed.box({
  top: '50%',
  left: '0',
  width: '100%',
  height: '30%',
  border: {
    type: 'line'
  },

  label: 'Portfolio',
  content: 'over here'
});
screen.append(portfolioBox);

// prompt
const prompt = blessed.prompt({
  top: '80%',
  left: '0',
  width: '100%',
  height: '20%',
  border: {
    type: 'line'
  },
  label: ' {blue-fg}Prompt{/blue-fg} ',
  tags: true,
});
screen.append(prompt);

prompt.input('>', '', function(err, value) {

});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
