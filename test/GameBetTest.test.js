const GameBetContract = artifacts.require('GameBetContract');


let accounts = null;
let gameBetContract = null;

const betAmount = 2;
const ETH_BET = () => {  
    currentBetCount++;
    return betAmount;
};
let currentBetCount = 0;

contract('GameBetContract contract account settings', () => {
    return;
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

        it("trueAccount Should get payment from player", async () => {
            const player1 = accounts[1];
            const trueAccount = await gameBetContract.betHolderTRUE();

            const amountOfEther = ETH_BET();  
            const bnAmount = web3.utils.toBN(amountOfEther);
            const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');

            await web3.eth.sendTransaction({from:player1,to:trueAccount, value:amoutInWEI});
            const balanceOfContract = await web3.eth.getBalance(trueAccount);
            const balanceInETH = Number(web3.utils.fromWei(balanceOfContract));
            assert.equal(amountOfEther, balanceInETH);
        });

        it("falseAccount Should get payment from player", async () => {
            const player2 = accounts[2];
            const falseAccount = await gameBetContract.betHolderFALSE();

            const amountOfEther = ETH_BET();  
            const bnAmount = web3.utils.toBN(amountOfEther);
            const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');

            await web3.eth.sendTransaction({from:player2,to:falseAccount, value:amoutInWEI});
            const balanceOfContract = await web3.eth.getBalance(falseAccount);
            const balanceInETH = Number(web3.utils.fromWei(balanceOfContract));
            assert.equal(amountOfEther, balanceInETH);
        });

        it("Should bet has done", async () => {
            const player3 = accounts[3];
            const trueAccount = await gameBetContract.betHolderTRUE();

            const amountOfEther = ETH_BET();  
            const bnAmount = web3.utils.toBN(amountOfEther);
            const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');

            await web3.eth.sendTransaction({from:player3,to:trueAccount, value:amoutInWEI});

            const balanceOfPlayer3 = await gameBetContract.getPlayerBalanceInTrueBets({from: player3});
            const balanceInETH = Number(web3.utils.fromWei(balanceOfPlayer3));
            assert.equal(amountOfEther, balanceInETH);
        });

        it(`Should returns all money to parent contract`, async () => {
            const player0 = accounts[0];

            const player1 = accounts[4];
            const player2 = accounts[5];
            const player3 = accounts[6];

            const amountOfEther = ETH_BET();  
            ETH_BET(); //for each player to increase count
            ETH_BET();

            const bnAmount = web3.utils.toBN(amountOfEther);
            const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');

            const trueAccount = await gameBetContract.betHolderTRUE();
            const falseAccout = await gameBetContract.betHolderFALSE();

            await web3.eth.sendTransaction({from:player1,to:trueAccount, value:amoutInWEI});
            await web3.eth.sendTransaction({from:player2,to:trueAccount, value:amoutInWEI});
            await web3.eth.sendTransaction({from:player3,to:falseAccout, value:amoutInWEI});
            
            await gameBetContract.finishBettingForTrue({from: player0});
            const balanceOfContract = await gameBetContract.getPlayersBettingPoolAmount();
            const balanceAfterTransaction = Number(web3.utils.fromWei(balanceOfContract));

            const totalBets = betAmount * currentBetCount;

            assert.equal(balanceAfterTransaction, totalBets);
        });
    });

});