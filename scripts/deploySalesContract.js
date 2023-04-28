const hre = require("hardhat");

async function main() {

  const XadeTokenSales = await hre.ethers.getContractFactory("XadeTokenSales");
  const xadeTokenSales = await XadeTokenSales.deploy("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174","0x762d10549A7Ed1a502d6dF2A50C2fD70dAfe9744");

  await xadeTokenSales.deployed();

  console.log(xadeTokenSales.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
