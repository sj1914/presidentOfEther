var Country = artifacts.require("./Country.sol");
module.exports = function(deployer) {
  deployer.deploy(Country, 'Shamerica', {gas: 67000});
};
