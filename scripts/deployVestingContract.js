const hre = require("hardhat");

async function main() {

  const XadeTokenVesting = await hre.ethers.getContractFactory("XadeTokenVesting");
  const xadeTokenVesting = await XadeTokenVesting.deploy("0x539259b8513d677B51fA9274fB7c81a69ac35d84");

  await xadeTokenVesting.deployed();

  console.log(xadeTokenVesting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
