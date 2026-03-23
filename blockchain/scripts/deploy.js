const hre = require("hardhat");

async function main() {
  const candidateNames = ["Candidate 1", "Candidate 2", "Candidate 3"];

  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy(candidateNames);
  await election.waitForDeployment();

  const address = await election.getAddress();
  console.log("Election deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
