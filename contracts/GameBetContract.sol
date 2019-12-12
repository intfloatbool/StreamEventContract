pragma solidity 0.5.12;
import "./BetHolderContract.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract GameBetContract is Ownable {

    BetHolderContract public betHolderTRUE;
    BetHolderContract public betHolderFALSE; 

    constructor() public payable {
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

    function finishBetting() public onlyOwner {
        betHolderTRUE.getAllMoney();
        betHolderFALSE.getAllMoney();
    }
}