const { ethers, upgrades } = require("hardhat");

async function getImplementation(proxyAddr) {
  const proxyAdmin = await upgrades.admin.getInstance();

  return proxyAdmin.getProxyImplementation(proxyAddr)
}

async function main() {

  const xadeTokenSales = await ethers.getContractFactory("XadeTokenSales");
  console.log("Deploying token sales...");
  const XadeTokenSales = await upgrades.deployProxy(xadeTokenSales, ["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "0x762d10549A7Ed1a502d6dF2A50C2fD70dAfe9744"], {initializer : "initialize" });
  await XadeTokenSales.deployed();

  const impAddr = await getImplementation(XadeTokenSales.address);

  console.log(`XadeTokenSales deployed to => Proxy: ${XadeTokenSales.address}, implementation: ${impAddr}`);

  return XadeTokenSales.address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});