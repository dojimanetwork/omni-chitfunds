// scripts/deploy.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
    // Fetch the accounts from Hardhat
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the ChitFundFactory contract factory
    const ChitFundFactory = await hre.ethers.getContractFactory("ChitFundFactory");
    const ChitFund = await hre.ethers.getContractFactory("ChitFund");

    console.log("Deploying ChitFundFactory...");
    const factory = await ChitFundFactory.deploy();
    await factory.deployed();
    console.log("ChitFundFactory deployed to:", factory.address);

    // Example of deploying a ChitFund contract through the factory
    const contributionAmount = hre.ethers.utils.parseEther("1"); // 1 Ether contribution
    const numMembers = 5; // The number of members in the chit fund

    console.log("Deploying a new ChitFund contract via the factory...");
    await factory.createChitFund(contributionAmount, numMembers);
    console.log("ChitFund contract deployed and created via the factory!");

    // If you want to interact with the deployed ChitFund contract:
    const deployedChitFunds = await factory.getAllDeployedChitFunds();
    console.log("Deployed ChitFund contracts:", deployedChitFunds);
    
    // Optionally, you can retrieve a specific ChitFund contract address and interact with it:
    const chitFundAddress = deployedChitFunds[0];
    const chitFund = await ChitFund.attach(chitFundAddress);

    console.log("Interacting with the deployed ChitFund contract:", chitFundAddress);

    // Example: Join the first member to the ChitFund (simulate with some Ether)
    const tx = await chitFund.connect(deployer).joinChitFund({ value: contributionAmount });
    await tx.wait();
    console.log("Member joined the ChitFund!");
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
