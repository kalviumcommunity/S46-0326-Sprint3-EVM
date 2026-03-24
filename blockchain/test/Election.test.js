const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election", function () {
  async function deployElectionFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();
    const Election = await ethers.getContractFactory("Election");
    const election = await Election.deploy(["Alice", "Bob", "Charlie"]);

    return { election, owner, voter1, voter2 };
  }

  it("deploys with valid candidates", async function () {
    const { election } = await deployElectionFixture();
    expect(await election.getCandidatesCount()).to.equal(3);
  });

  it("records a vote once per address", async function () {
    const { election, voter1 } = await deployElectionFixture();

    await election.connect(voter1).vote(1);

    expect(await election.getVotes(1)).to.equal(1);
    await expect(election.connect(voter1).vote(1)).to.be.revertedWith("Already voted");
  });

  it("rejects invalid candidate index", async function () {
    const { election, voter2 } = await deployElectionFixture();

    await expect(election.connect(voter2).vote(99)).to.be.revertedWith("Invalid candidate index");
  });
});
