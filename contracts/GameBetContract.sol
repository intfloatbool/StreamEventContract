pragma solidity 0.5.12;


contract GameBetContract {
    uint public balance;
    event Receive(uint value, address payable from);
    constructor() public payable {

    }

    function () external payable {
        emit Receive(msg.value, msg.sender);
    }
    function makeBet(bool condition) public {
    }

    function getLastBet() public view returns(bool) {
    }
}