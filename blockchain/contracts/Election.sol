// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Election {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    event VoteCast(address indexed voter, uint256 indexed candidateIndex);

    constructor(string[] memory candidateNames) {
        require(candidateNames.length > 1, "At least 2 candidates required");

        for (uint256 i = 0; i < candidateNames.length; i++) {
            require(bytes(candidateNames[i]).length > 0, "Candidate name required");
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function vote(uint256 candidateIndex) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate index");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;

        emit VoteCast(msg.sender, candidateIndex);
    }

    function getVotes(uint256 index) external view returns (uint256) {
        require(index < candidates.length, "Invalid candidate index");
        return candidates[index].voteCount;
    }

    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }
}
