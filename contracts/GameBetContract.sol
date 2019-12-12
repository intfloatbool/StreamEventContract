pragma solidity 0.5.12;
import "./BetHolderContract.sol";

contract GameBetContract {

    BetHolderContract public betHolderTRUE;
    BetHolderContract public betHolderFALSE; 

    constructor() public payable {
        betHolderTRUE = new BetHolderContract();
        betHolderFALSE = new BetHolderContract();
    }

    //this function necessary to get payments!
    function () external payable {}

    function getPlayerBalanceInTrueBets() public view returns(uint256) {
        return betHolderTRUE.players(msg.sender);
    }

    function getPlayerBalanceInFalseBets() public view returns(uint256) {
        return betHolderFALSE.players(msg.sender);
    }
}