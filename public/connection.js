const Web3 = require('web3');

module.exports = {

  networkConnection: function () {
  let provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/56667efd2d3e44379d4692565e853620");
  var web3 = new Web3(provider);
  return web3;
  }
  }