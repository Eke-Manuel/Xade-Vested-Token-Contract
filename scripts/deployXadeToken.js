const hre = require("hardhat");

async function main() {

  const Xade = await hre.ethers.getContractFactory("Xade");
  const xade = await Xade.deploy();

  await xade.deployed();

  console.log(xade.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
