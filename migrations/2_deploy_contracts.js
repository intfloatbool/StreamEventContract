const GameBetContract = artifacts.require("GameBetContract");

module.exports = function(deployer) {
  deployer.deploy(GameBetContract);
};