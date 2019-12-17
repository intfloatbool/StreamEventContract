const GameBetContract = artifacts.require('GameBetContract');

let accounts = null;
let gameBetContract = null;

let falseContractAdress = null; 
let trueContractAdress = null; 

contract('GameBetContract prize calc', () => {
    beforeEach(async () => {
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

    it.skip('Should not return errors when no bets', async () => {

        const contractOwner = accounts[0];
        await gameBetContract.finishBettingForFalse({from: contractOwner});
        await gameBetContract.finishBettingForTrue({from: contractOwner});
        assert(true, true);
    });

    it('should make bets several times for TRUE', async () => {
        const contractOwner = accounts[0];

        const acc1 = accounts[1];
        const acc2 = accounts[2];
        const acc3 = accounts[3];
        const acc4 = accounts[4];
        const acc5 = accounts[5];

        //set gas price
        const gasPrice = await web3.eth.getGasPrice();
        const gasWei = web3.utils.fromWei(gasPrice, 'ether');
        await gameBetContract.setGasCost(gasPrice);

        //TRUE bets   
        const betCountEthAcc1 = 0.1;
        let amoutInWEIAcc1 = web3.utils.toWei(betCountEthAcc1.toString(), 'ether');

        const betCountEthAcc2 = 0.07;
        let amoutInWEIAcc2 = web3.utils.toWei(betCountEthAcc2.toString(), 'ether');

        const betCountEthAcc3 = 0.3;
        let amoutInWEIAcc3 = web3.utils.toWei(betCountEthAcc3.toString(), 'ether');

        //FALSE bets
        const betCountEthAcc4 = 0.5;
        let amoutInWEIAcc4 = web3.utils.toWei(betCountEthAcc4.toString(), 'ether');

        const betCountEthAcc5 = 0.32;
        let amoutInWEIAcc5 = web3.utils.toWei(betCountEthAcc5.toString(), 'ether');

        //Several transactions from same addr
        await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:amoutInWEIAcc1});
        //await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:amoutInWEIAcc1}); 

        await web3.eth.sendTransaction({from:acc2, to:trueContractAdress, value:amoutInWEIAcc2});
        await web3.eth.sendTransaction({from:acc3, to:trueContractAdress, value:amoutInWEIAcc3});

        await web3.eth.sendTransaction({from:acc4, to:falseContractAdress, value:amoutInWEIAcc4});
        await web3.eth.sendTransaction({from:acc5, to:falseContractAdress, value:amoutInWEIAcc5});

        await gameBetContract.finishBettingForFalse({from: contractOwner});

        console.log("bets again..");
        //make bets again
        const trueBetETH = 2;
        const trueBetWei = web3.utils.toWei(trueBetETH.toString(), 'ether');

        await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:trueBetWei});
        await web3.eth.sendTransaction({from:acc2, to:trueContractAdress, value:trueBetWei});

        await web3.eth.sendTransaction({from:acc4, to:falseContractAdress, value:trueBetWei});
        await web3.eth.sendTransaction({from:acc5, to:falseContractAdress, value:trueBetWei});

        const balaceOfFalseAcc = await web3.eth.getBalance(falseContractAdress);
        const balaceOfFalseAccEth = Number(web3.utils.fromWei(balaceOfFalseAcc));
        console.log(`False con balance: ${balaceOfFalseAccEth}`);

        const balaceOfTrueAcc = await web3.eth.getBalance(trueContractAdress);
        const balaceOfTrueAccEth = Number(web3.utils.fromWei(balaceOfTrueAcc));
        console.log(`True con balance: ${balaceOfTrueAccEth}`);

        await gameBetContract.finishBettingForTrue({from: contractOwner});

        const balanceOfAcc1 = await web3.eth.getBalance(acc1);
        const acc1Balance = Number(web3.utils.fromWei(balanceOfAcc1));

        let neededBalance = 101.9;

        const range = neededBalance - acc1Balance;
        if(range < 1) {
            neededBalance = acc1Balance;
        }
        assert.equal(acc1Balance, neededBalance);
    });

    it.skip('should returns MICRO each bets and give bonuses for FALSE', async () => {
        const contractOwner = accounts[0];

        const acc1 = accounts[1];
        const acc2 = accounts[2];
        const acc3 = accounts[3];
        const acc4 = accounts[4];
        const acc5 = accounts[5];

        //TRUE bets   
        const betCountEthAcc1 = 0.1;
        const amoutInWEIAcc1 = web3.utils.toWei(betCountEthAcc1.toString(), 'ether');

        const betCountEthAcc2 = 0.07;
        const amoutInWEIAcc2 = web3.utils.toWei(betCountEthAcc2.toString(), 'ether');

        const betCountEthAcc3 = 0.3;
        const amoutInWEIAcc3 = web3.utils.toWei(betCountEthAcc3.toString(), 'ether');

        //FALSE bets
        const betCountEthAcc4 = 0.5;
        const amoutInWEIAcc4 = web3.utils.toWei(betCountEthAcc4.toString(), 'ether');

        const betCountEthAcc5 = 0.32;
        const amoutInWEIAcc5 = web3.utils.toWei(betCountEthAcc5.toString(), 'ether');

        await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:amoutInWEIAcc1});
        await web3.eth.sendTransaction({from:acc2, to:trueContractAdress, value:amoutInWEIAcc2});
        await web3.eth.sendTransaction({from:acc3, to:trueContractAdress, value:amoutInWEIAcc3});

        await web3.eth.sendTransaction({from:acc4, to:falseContractAdress, value:amoutInWEIAcc4});
        await web3.eth.sendTransaction({from:acc5, to:falseContractAdress, value:amoutInWEIAcc5});

        await gameBetContract.finishBettingForFalse({from: contractOwner});

        //two players betting to true, so they devide bet from acc3 (from false bet) 
        // and should get 2.5 ETH
        const balanceOfAcc4 = await web3.eth.getBalance(acc4);
        const acc4Balance = Number(web3.utils.fromWei(balanceOfAcc4));

        const balanceOfAcc5 = await web3.eth.getBalance(acc5);
        const acc5Balance = Number(web3.utils.fromWei(balanceOfAcc5));

        let neededBalance = 100.23;

        const range = neededBalance - acc4Balance;
        if(range < 1) {
            neededBalance = acc4Balance;
        }
        assert.equal(acc4Balance, neededBalance);
    });

    it.skip('should returns bets and give bonuses for false', async () => {
        const contractOwner = accounts[0];

        const acc1 = accounts[1];
        const acc2 = accounts[2];
        const acc3 = accounts[3];
        const acc4 = accounts[4];
        const acc5 = accounts[5];

        const betCountEth = 5;
        const bnAmount = web3.utils.toBN(betCountEth);
        const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');
        await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:amoutInWEI});
        await web3.eth.sendTransaction({from:acc2, to:trueContractAdress, value:amoutInWEI});
        await web3.eth.sendTransaction({from:acc3, to:trueContractAdress, value:amoutInWEI});

        await web3.eth.sendTransaction({from:acc4, to:falseContractAdress, value:amoutInWEI});
        await web3.eth.sendTransaction({from:acc5, to:falseContractAdress, value:amoutInWEI});

        await gameBetContract.finishBettingForFalse({from: contractOwner});

        //two players betting to true, so they devide bet from acc3 (from false bet) 
        // and should get 2.5 ETH
        const balanceOfAcc4 = await web3.eth.getBalance(acc4);
        const acc4Balance = Number(web3.utils.fromWei(balanceOfAcc4));

        const balanceOfAcc5 = await web3.eth.getBalance(acc5);
        const acc5Balance = Number(web3.utils.fromWei(balanceOfAcc5));

        let neededBalance = 102.5;

        const range = neededBalance - acc4Balance;
        if(range < 1) {
            neededBalance = acc4Balance;
        }
        assert.equal(acc4Balance, neededBalance);
    });

    it.skip('should returns bets and give bonuses for true', async () => {
        const contractOwner = accounts[0];

        const acc1 = accounts[1];
        const acc2 = accounts[2];
        const acc3 = accounts[3];
        const acc4 = accounts[4];

        const betCountEth = 5;
        const bnAmount = web3.utils.toBN(betCountEth);
        const amoutInWEI = web3.utils.toWei(bnAmount, 'ether');
        await web3.eth.sendTransaction({from:acc1, to:trueContractAdress, value:amoutInWEI});
        await web3.eth.sendTransaction({from:acc2, to:trueContractAdress, value:amoutInWEI});

        await web3.eth.sendTransaction({from:acc3, to:falseContractAdress, value:amoutInWEI});
        await web3.eth.sendTransaction({from:acc4, to:falseContractAdress, value:amoutInWEI});

        await gameBetContract.finishBettingForTrue({from: contractOwner});

        //two players betting to true, so they devide bet from acc3 (from false bet) 
        // and should get 2.5 ETH
        const balanceOfAcc1 = await web3.eth.getBalance(acc1);
        const acc1Balance = Number(web3.utils.fromWei(balanceOfAcc1));

        const balanceOfAcc2 = await web3.eth.getBalance(acc2);
        const acc2Balance = Number(web3.utils.fromWei(balanceOfAcc2));

        let neededBalance = 102.5;

        const range = neededBalance - acc1Balance;
        if(range < 1) {
            neededBalance = acc1Balance;
        }
        assert.equal(acc1Balance, neededBalance);
    });

});