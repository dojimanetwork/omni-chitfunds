// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ChitFund.sol";  // Import the ChitFund contract to use it

contract ChitFundFactory {
    address public factoryOwner;
    address[] public deployedChitFunds;

    event ChitFundCreated(address indexed chitFundAddress);

    modifier onlyFactoryOwner() {
        require(msg.sender == factoryOwner, "Only factory owner can perform this action");
        _;
    }

    constructor() {
        factoryOwner = msg.sender;
    }

    // Function to deploy a new ChitFund contract
    function createChitFund(uint256 contributionAmount, uint256 numMembers) external onlyFactoryOwner {
        // Deploy a new ChitFund contract
        ChitFund newChitFund = new ChitFund(contributionAmount, numMembers);

        // Store the deployed chit fund contract address
        deployedChitFunds.push(address(newChitFund));

        // Emit an event that a new chit fund was created
        emit ChitFundCreated(address(newChitFund));
    }

    // Get all deployed ChitFund addresses
    function getAllDeployedChitFunds() external view returns (address[] memory) {
        return deployedChitFunds;
    }

    // Function to interact with a specific ChitFund contract
    function interactWithChitFund(address chitFundAddress, uint256 action) external payable {
        ChitFund chitFund = ChitFund(chitFundAddress);
        
        if (action == 1) {
            // Join the ChitFund (only if msg.value is sent)
            require(msg.value > 0, "You must send ether to join");
            chitFund.joinChitFund{value: msg.value}();
        } else if (action == 2) {
            // Start an auction for this ChitFund
            chitFund.startAuction();
        } else if (action == 3) {
            // End the auction for this ChitFund
            chitFund.endAuction();
        } else {
            revert("Invalid action");
        }
    }
}
