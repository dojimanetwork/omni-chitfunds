// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChitFund {
    struct Member {
        address memberAddress;
        uint256 totalContributed;
        bool hasWon;
    }

    address public owner;
    uint256 public totalPoolAmount;
    uint256 public contributionAmount;
    uint256 public auctionCycle;
    uint256 public numMembers;
    uint256 public membersCount;
    uint256 public auctionWinnerIndex;

    mapping(address => Member) public members;
    address[] public memberAddresses;
    address[] public auctionBidders;

    event MemberJoined(address indexed member);
    event AuctionStarted(uint256 auctionCycle);
    event AuctionEnded(address winner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyMembers() {
        require(members[msg.sender].memberAddress != address(0), "You are not a member");
        _;
    }

    constructor(uint256 _contributionAmount, uint256 _numMembers) {
        owner = msg.sender;
        contributionAmount = _contributionAmount;
        numMembers = _numMembers;
        auctionCycle = 1;
        membersCount = 0;
    }

    // Allow a participant to join the chit fund by contributing
    function joinChitFund() external payable {
        require(membersCount < numMembers, "Chit fund is full");
        require(msg.value == contributionAmount, "Incorrect contribution amount");

        // Ensure member isn't already part of the fund
        require(members[msg.sender].memberAddress == address(0), "Already a member");

        // Add member
        members[msg.sender] = Member({
            memberAddress: msg.sender,
            totalContributed: msg.value,
            hasWon: false
        });
        memberAddresses.push(msg.sender);
        membersCount++;

        // Emit the event for a new member joining
        emit MemberJoined(msg.sender);
    }

    // Start an auction for the current cycle
    function startAuction() external onlyOwner {
        require(membersCount == numMembers, "Not all members have joined yet");
        require(auctionCycle <= numMembers, "All cycles are completed");

        // Reset auction state
        delete auctionBidders;

        // Collect bids from members (bid in the form of amounts, for simplicity)
        for (uint i = 0; i < memberAddresses.length; i++) {
            address member = memberAddresses[i];
            if (!members[member].hasWon) {
                auctionBidders.push(member);
            }
        }

        // Emit event that auction has started
        emit AuctionStarted(auctionCycle);
    }

    // Members place a bid (in terms of how much they want to discount the pool value)
    function placeBid(uint256 discountAmount) external onlyMembers {
        require(auctionCycle <= numMembers, "No active auctions");
        require(!members[msg.sender].hasWon, "You already won your cycle");
        
        // The bid must be a reasonable amount and cannot exceed the total pool
        uint256 maxBid = totalPoolAmount - contributionAmount;
        require(discountAmount <= maxBid, "Bid exceeds the allowed amount");

        // No double bidding allowed
        for (uint i = 0; i < auctionBidders.length; i++) {
            if (auctionBidders[i] == msg.sender) {
                revert("Already placed a bid");
            }
        }
        auctionBidders.push(msg.sender);
    }

    // End the auction, selecting the member with the lowest bid
    function endAuction() external onlyOwner {
        require(auctionBidders.length > 0, "No bids placed");
        
        uint256 winningBid = type(uint256).max;
        address winningBidder;
        
        // Find the bidder with the lowest discount bid
        for (uint i = 0; i < auctionBidders.length; i++) {
            address bidder = auctionBidders[i];
            uint256 bid = members[bidder].totalContributed;
            
            if (bid < winningBid) {
                winningBid = bid;
                winningBidder = bidder;
            }
        }

        // Mark the winning member
        members[winningBidder].hasWon = true;
        totalPoolAmount += contributionAmount;

        // Payout to the winner
        payable(winningBidder).transfer(totalPoolAmount);

        // Emit event for auction result
        emit AuctionEnded(winningBidder, totalPoolAmount);

        // Move to next auction cycle
        auctionCycle++;

        // Reset pool amount for the next cycle
        totalPoolAmount = 0;
    }

    // Allow a member to withdraw their contributions if they haven't won
    function withdraw() external onlyMembers {
        require(members[msg.sender].hasWon == false, "You have already won");
        require(address(this).balance >= contributionAmount, "Not enough funds in the contract");

        payable(msg.sender).transfer(contributionAmount);
    }
}
