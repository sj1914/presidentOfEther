var Country = artifacts.require("./Country.sol");
module.exports = function(deployer) {
  deployer.deploy(Country, 'Fairyland', {gas: 6700000});
};
