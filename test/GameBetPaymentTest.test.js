const GameBetContract = artifacts.require('GameBetContract');

let accounts = null;
let gameBetContract = null;

contract('GameBetContract prize calc', () => {
    before(async () => {
        accounts = await web3.eth.getAccounts();
        gameBetContract = await GameBetContract.new();
    });

    describe('GameBets for true or fals', () => {

    });

});