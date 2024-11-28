const { ethers } = require("hardhat");

async function deployChitFundFactory() {
    const ChitFundFactory = await ethers.getContractFactory("ChitFundFactory");
    const factory = await ChitFundFactory.deploy();
    await factory.deployed();
    return factory;
}

async function deployChitFund(contributionAmount, numMembers) {
    const factory = await deployChitFundFactory();
    await factory.createChitFund(contributionAmount, numMembers);
    
    const deployedChitFunds = await factory.getAllDeployedChitFunds();
    return await ethers.getContractAt("ChitFund", deployedChitFunds[0]);
}

module.exports = { deployChitFundFactory, deployChitFund };
