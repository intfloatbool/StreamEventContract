pragma solidity 0.5.12;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract BetHolderContract is Ownable {
    mapping(address => uint256) public players;
    address payable[] private playersArr;
    address payable private _parentAddress;

    uint256 private _gasUsed;

    constructor(address payable parentAddress) public {
        _parentAddress = parentAddress;
    }

    function setGasCosts(uint256 gasCost) public onlyOwner {
        _gasUsed = gasCost;
    }

     //this function necessary to get payments!
    function () external payable {
        players[msg.sender] = msg.value;
        playersArr.push(msg.sender);
    }

    function getTotalMoneys() public view returns(uint) {
        uint256 amount = 0;
        for(uint i = 0; i < playersArr.length; i++) {
            address playerAddress = playersArr[i];
            amount += players[playerAddress];
        }
        return amount;
    }

    function getPlayers() public view returns(address payable[] memory) {
        return playersArr;
    }

    function getAllMoney() public onlyOwner {
        uint256 amount = 0;
        for(uint i = 0; i < playersArr.length; i++) {
            address playerAddress = playersArr[i];
            amount += players[playerAddress];
        }
        if(amount > 0) {
            uint256 valueToSend = amount - _gasUsed - gasleft();
            _parentAddress.transfer(valueToSend);
        }

        delete playersArr;
    }
}