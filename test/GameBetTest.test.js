const GameBetContract = artifacts.require('GameBetContract');


let accounts = null;
let gameBetContract = null;

contract('GameBetContract contract', () => {
    before(async () => {
        accounts = await web3.eth.getAccounts();
        gameBetContract = await GameBetContract.new();
    });

    describe("GameBet payment checking", () => {
        it("balance increased", async () => {
            //send 50 ether to wallet for test  
            const amountOfEther = 1;  
            const bnAmount = web3.utils.toBN(amountOfEther);
            const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');
            const balanceOfContractBeforeETH = 0;
            await web3.eth.sendTransaction({from:accounts[0],to:gameBetContract.address, value:amoutInWEI});
            const balanceOfContract = await web3.eth.getBalance(gameBetContract.address);
            const balanceAfterTransaction = web3.utils.fromWei(balanceOfContract);
            assert.equal(balanceAfterTransaction > balanceOfContractBeforeETH, true);
        });
    });

    describe("Leaf contracts", () => {
        it("Should all leafs exists", async () => {
            const trueAccount = await gameBetContract.betHolderTRUE();
            const falseAccout = await gameBetContract.betHolderFALSE();
            assert.equal(!trueAccount && !falseAccout, false);
        });

        it("Should have gameBetContract as owner", async () => {
            
        });
    });

});