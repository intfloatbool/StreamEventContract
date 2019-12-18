pragma solidity 0.5.12;
import "./BetHolderContract.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract GameBetContract is Ownable {

    BetHolderContract public betHolderTRUE;
    BetHolderContract public betHolderFALSE;

    mapping(address => uint256) public truePlayersHashTable;
    address payable[] private truePlayersArr;

    mapping(address => uint256) public falsePlayersHashTable;
    address payable[] private falsePlayersArr;

    constructor() Ownable() public payable {
        betHolderTRUE = new BetHolderContract(address(this));
        betHolderFALSE = new BetHolderContract(address(this));
    }

    //this function necessary to get payments!
    function () external payable {}

    function getPlayerBalanceInTrueBets() public view returns(uint256) {
        return betHolderTRUE.players(msg.sender);
    }

    function getPlayerBalanceInFalseBets() public view returns(uint256) {
        return betHolderFALSE.players(msg.sender);
    }

    function setGasCost(uint256 gasCost) public onlyOwner {
        betHolderTRUE.setGasCosts(gasCost);
        betHolderFALSE.setGasCosts(gasCost);
    }

    function finishBettingForTrue() public onlyOwner {
        savePlayersFromChilds();
        if(truePlayersArr.length > 0) {
            betHolderTRUE.getAllMoney();
            betHolderFALSE.getAllMoney();
            sendAllMoneysToTrue();
        }
    }

    function finishBettingForFalse() public onlyOwner {
        savePlayersFromChilds();
        if(falsePlayersArr.length > 0) {
            betHolderTRUE.getAllMoney();
            betHolderFALSE.getAllMoney();
            sendAllMoneysToFalse();
        }
    }

    function sendAllMoneysToTrue() private {
        uint sum = 0;
        for(uint i = 0; i < falsePlayersArr.length; i++) {
            address payable player = falsePlayersArr[i];
            sum += betHolderFALSE.players(player);
        }

        //devide sum by true players
        if(sum > 0 && truePlayersArr.length > 0) {
            uint eachPayment = sum / truePlayersArr.length;

            for(uint i = 0; i < truePlayersArr.length; i++) {
                address payable player = truePlayersArr[i];
                uint trueBet = betHolderTRUE.players(player);
                uint total = eachPayment + trueBet;
                player.transfer(total);
            }
        }
    }

    function sendAllMoneysToFalse() private {
        uint sum = 0;
        for(uint i = 0; i < truePlayersArr.length; i++) {
            address payable player = truePlayersArr[i];
            sum += betHolderTRUE.players(player);
        }

        //devide sum by true players
        if(sum > 0 && falsePlayersArr.length > 0) {
            uint eachPayment = sum / falsePlayersArr.length;

            for(uint i = 0; i < falsePlayersArr.length; i++) {
                address payable player = falsePlayersArr[i];
                uint falseBet = betHolderFALSE.players(player);
                uint total = eachPayment + falseBet;
                player.transfer(total);
            }
        }
    }

    function getPlayersBettingPoolAmount() public view returns(uint256) {
        uint256 bets = 0;
        bets += betHolderTRUE.getTotalMoneys();
        bets += betHolderFALSE.getTotalMoneys();

        return bets;
    }

    function savePlayersFromChilds() private {
        delete truePlayersArr;
        delete falsePlayersArr;

        address payable[] memory truePlayers = betHolderTRUE.getPlayers();
        address payable[] memory falsePlayers = betHolderFALSE.getPlayers();

        for(uint i = 0; i < truePlayers.length; i++) {
            address payable player = truePlayers[i];
            truePlayersArr.push(player);
        }

        for(uint i = 0; i < falsePlayers.length; i++) {
            address payable player = falsePlayers[i];
            falsePlayersArr.push(player);
        }

        for(uint i = 0; i < truePlayersArr.length; i++) {
            address payable player = truePlayersArr[i];
            truePlayersHashTable[player] = betHolderTRUE.players(player);
        }

        for(uint i = 0; i < falsePlayersArr.length; i++) {
            address payable player = falsePlayersArr[i];
            falsePlayersHashTable[player] = betHolderFALSE.players(player);
        }
    }
}