// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UmiCoreDAO {
    enum Status { Pending, Active, Inactive }

    struct Proposal {
        uint id;
        string title;
        string description;
        address proposer;
        uint voteYes;
        uint voteNo;
        uint createdAt;
        uint deadline;
        Status status;
        uint donations;
        bool withdrawn;
    }

    uint public proposalCount;
    mapping(uint => Proposal) public proposals;
    mapping(uint => mapping(address => bool)) public hasVoted;

    uint public voteThresholdPercent = 60; // % required to activate proposal
    uint public minVotes = 1;              // minimum votes required to finalize

    event ProposalCreated(uint id, string title, address proposer, uint deadline);
    event Voted(uint id, address voter, bool support);
    event ProposalFinalized(uint id, Status status);
    event DonationReceived(uint id, address donor, uint amount);
    event DonationWithdrawn(uint id, address to, uint amount);

    // ============================
    // 🧱 Core Functions
    // ============================

    function createProposal(
        string memory _title,
        string memory _description,
        uint _deadline
    ) public {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            proposer: msg.sender,
            voteYes: 0,
            voteNo: 0,
            createdAt: block.timestamp,
            deadline: _deadline,
            status: Status.Pending,
            donations: 0,
            withdrawn: false
        });

        emit ProposalCreated(proposalCount, _title, msg.sender, _deadline);
    }

    function vote(uint _id, bool _support) public {
        Proposal storage p = proposals[_id];
        require(block.timestamp < p.deadline, "Voting ended");
        require(!hasVoted[_id][msg.sender], "Already voted");

        hasVoted[_id][msg.sender] = true;

        if (_support) {
            p.voteYes++;
        } else {
            p.voteNo++;
        }

        emit Voted(_id, msg.sender, _support);
    }

    function finalizeProposal(uint _id) public {
        Proposal storage p = proposals[_id];
        require(block.timestamp >= p.deadline, "Voting still active");
        require(p.status == Status.Pending, "Already finalized");

        uint totalVotes = p.voteYes + p.voteNo;
        require(totalVotes >= minVotes, "Not enough votes");

        uint yesPercent = (p.voteYes * 100) / totalVotes;
        if (yesPercent >= voteThresholdPercent) {
            p.status = Status.Active;
        } else {
            p.status = Status.Inactive;
        }

        emit ProposalFinalized(_id, p.status);
    }

    function donate(uint _id) public payable {
        Proposal storage p = proposals[_id];
        require(p.status == Status.Active, "Proposal not active");
        require(msg.value > 0, "Must send ETH");

        p.donations += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function withdrawDonations(uint _id) public {
        Proposal storage p = proposals[_id];
        require(msg.sender == p.proposer, "Only proposer can withdraw");
        require(p.status == Status.Active, "Proposal not active");
        require(!p.withdrawn, "Already withdrawn");
        require(p.donations > 0, "No donations");

        p.withdrawn = true;
        uint amount = p.donations;
        p.donations = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Transfer failed");

        emit DonationWithdrawn(_id, msg.sender, amount);
    }

    // ============================
    // 🔍 View Functions
    // ============================

    function getProposal(uint _id) public view returns (
        uint id,
        string memory title,
        string memory description,
        address proposer,
        uint voteYes,
        uint voteNo,
        uint createdAt,
        uint deadline,
        Status status,
        uint donations,
        bool withdrawn
    ) {
        Proposal memory p = proposals[_id];
        return (
            p.id, p.title, p.description, p.proposer,
            p.voteYes, p.voteNo, p.createdAt,
            p.deadline, p.status, p.donations, p.withdrawn
        );
    }

    function listProposals() public view returns (Proposal[] memory) {
        Proposal[] memory list = new Proposal[](proposalCount);
        for (uint i = 1; i <= proposalCount; i++) {
            list[i - 1] = proposals[i];
        }
        return list;
    }

    function getVoteResults(uint _id) public view returns (uint yesPercent, uint noPercent) {
        Proposal memory p = proposals[_id];
        uint totalVotes = p.voteYes + p.voteNo;
        if (totalVotes == 0) return (0, 0);
        yesPercent = (p.voteYes * 100) / totalVotes;
        noPercent = (p.voteNo * 100) / totalVotes;
    }
}
