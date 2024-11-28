// Import dependencies
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ChitFund Contract", function () {
    let ChitFund;
    let factory;
    let owner;
    let member1;
    let member2;
    let member3;
    let member4;
    let member5;
    let chitFund;
    const contributionAmount = ethers.utils.parseEther("1"); // 1 Ether contribution
    const numMembers = 5; // Number of members in the chit fund

    beforeEach(async function () {
        // Get signers
        [owner, member1, member2, member3, member4, member5] = await ethers.getSigners();

        // Deploy ChitFundFactory contract
        const ChitFundFactory = await ethers.getContractFactory("ChitFundFactory");
        factory = await ChitFundFactory.deploy();
        await factory.deployed();

        // Create a new ChitFund contract via the factory
        await factory.createChitFund(contributionAmount, numMembers);

        // Get the address of the deployed ChitFund contract
        const deployedChitFunds = await factory.getAllDeployedChitFunds();
        chitFund = await ethers.getContractAt("ChitFund", deployedChitFunds[0]);
    });

    it("should deploy the ChitFund contract and add members", async function () {
        // Member1 joins the ChitFund
        await expect(chitFund.connect(member1).joinChitFund({ value: contributionAmount }))
            .to.emit(chitFund, "MemberJoined")
            .withArgs(member1.address);

        // Member2 joins the ChitFund
        await expect(chitFund.connect(member2).joinChitFund({ value: contributionAmount }))
            .to.emit(chitFund, "MemberJoined")
            .withArgs(member2.address);

        // Check if the members have been added
        const member1Data = await chitFund.members(member1.address);
        const member2Data = await chitFund.members(member2.address);

        expect(member1Data.totalContributed).to.equal(contributionAmount);
        expect(member2Data.totalContributed).to.equal(contributionAmount);
    });

    it("should allow only the owner to start an auction", async function () {
        // Owner starts the auction
        await expect(chitFund.connect(owner).startAuction())
            .to.emit(chitFund, "AuctionStarted")
            .withArgs(1);

        // Non-owner should not be able to start the auction
        await expect(chitFund.connect(member1).startAuction())
            .to.be.revertedWith("Only owner can perform this action");
    });

    it("should allow members to place bids", async function () {
        // Members join the fund
        await chitFund.connect(member1).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member2).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member3).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member4).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member5).joinChitFund({ value: contributionAmount });

        // Owner starts the auction
        await chitFund.connect(owner).startAuction();

        // Member1 places a bid
        await expect(chitFund.connect(member1).placeBid(ethers.utils.parseEther("0.5")))
            .to.emit(chitFund, "BidPlaced")
            .withArgs(member1.address, ethers.utils.parseEther("0.5"));

        // Member2 places a bid
        await expect(chitFund.connect(member2).placeBid(ethers.utils.parseEther("0.3")))
            .to.emit(chitFund, "BidPlaced")
            .withArgs(member2.address, ethers.utils.parseEther("0.3"));
    });

    it("should end the auction and payout the winner", async function () {
        // Members join the fund
        await chitFund.connect(member1).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member2).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member3).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member4).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member5).joinChitFund({ value: contributionAmount });

        // Start the auction
        await chitFund.connect(owner).startAuction();

        // Members place bids
        await chitFund.connect(member1).placeBid(ethers.utils.parseEther("0.5"));
        await chitFund.connect(member2).placeBid(ethers.utils.parseEther("0.3"));
        await chitFund.connect(member3).placeBid(ethers.utils.parseEther("0.4"));
        await chitFund.connect(member4).placeBid(ethers.utils.parseEther("0.2"));
        await chitFund.connect(member5).placeBid(ethers.utils.parseEther("0.6"));

        // End the auction and payout the winner
        await expect(chitFund.connect(owner).endAuction())
            .to.emit(chitFund, "AuctionEnded")
            .withArgs(member4.address, contributionAmount * numMembers);

        // Check if the winner (member4) received the payout
        const winnerBalance = await ethers.provider.getBalance(member4.address);
        expect(winnerBalance).to.be.above(contributionAmount * numMembers);
    });

    it("should allow members to withdraw if they haven't won", async function () {
        // Members join the fund
        await chitFund.connect(member1).joinChitFund({ value: contributionAmount });
        await chitFund.connect(member2).joinChitFund({ value: contributionAmount });

        // Start the auction
        await chitFund.connect(owner).startAuction();

        // Place bids
        await chitFund.connect(member1).placeBid(ethers.utils.parseEther("0.5"));
        await chitFund.connect(member2).placeBid(ethers.utils.parseEther("0.3"));

        // End the auction
        await chitFund.connect(owner).endAuction();

        // Member1 (not the winner) tries to withdraw their contribution
        const balanceBeforeWithdraw = await ethers.provider.getBalance(member1.address);
        await expect(chitFund.connect(member1).withdraw())
            .to.emit(chitFund, "Withdrawal")
            .withArgs(member1.address, contributionAmount);

        const balanceAfterWithdraw = await ethers.provider.getBalance(member1.address);
        expect(balanceAfterWithdraw).to.be.above(balanceBeforeWithdraw);
    });
});
