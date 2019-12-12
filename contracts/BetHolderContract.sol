pragma solidity 0.5.12;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract BetHolderContract is Ownable {
    mapping(address => uint256) public players;
    constructor() public {

    }

     //this function necessary to get payments!
    function () external payable {
        players[msg.sender] = msg.value;
    }
}