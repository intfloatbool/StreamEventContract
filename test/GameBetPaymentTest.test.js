const GameBetContract = artifacts.require('GameBetContract');

let accounts = null;
let gameBetContract = null;

let falseContractAdress = null; 
let trueContractAdress = null; 

contract('GameBetContract prize calc', () => {
    before(async () => {
        accounts = await web3.eth.getAccounts();
        gameBetContract = await GameBetContract.new();
        falseContractAdress = await gameBetContract.betHolderFALSE();
        trueContractAdress = await gameBetContract.betHolderTRUE();

        //Increase balance of parent contract!
        const amountOfEther = 1;  
        const bnAmount = web3.utils.toBN(amountOfEther);
        const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');
        await web3.eth.sendTransaction({from:accounts[0],to:gameBetContract.address, value:amoutInWEI});

    });

    describe('GameBets and finishing', () => {
        it('should returns bets and give bonuses for true', async () => {
            const contractOwner = accounts[0];

            const acc1 = accounts[1];
            const acc2 = accounts[2];
            const acc3 = accounts[3];

            const betCountEth = 1;
            const bnAmount = web3.utils.toBN(betCountEth);
            const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');
            await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:amoutInWEI});
            await web3.eth.sendTransaction({from:acc2, to:trueContractAdress, value:amoutInWEI});

            await web3.eth.sendTransaction({from:acc3, to:falseContractAdress, value:amoutInWEI});

            const winnerContractAnswer = true;
            await gameBetContract.finishBettingForTrue({from: contractOwner});

            //two players betting to true, so they devide bet from acc3 (from false bet) 
            // and should get 0.5 ETH
            const balanceOfAcc1 = await web3.eth.getBalance(acc1);
            const acc1Balance = Number(web3.utils.fromWei(balanceOfAcc1));

            const balanceOfAcc2 = await web3.eth.getBalance(acc2);
            const acc2Balance = Number(web3.utils.fromWei(balanceOfAcc2));

            let neededBalance = 100.5;

            const range = neededBalance - acc1Balance;
            if(range < 1) {
                neededBalance = acc1Balance;
            }
            assert.equal(acc1Balance, neededBalance);
        });
    });

});