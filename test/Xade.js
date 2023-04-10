const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Xade", function () {
  let Xade, xade, dev, alice, bob;

  const INITIAL_MINT_AMOUNT = ethers.utils.parseEther("1000000000"); // 1 billion Xade

  beforeEach(async function () {
    [dev, alice, bob] = await ethers.getSigners();
    Xade = await ethers.getContractFactory("Xade");
    xade = await Xade.connect(dev).deploy();
    await xade.deployed();
  });

  it("Should have correct initial state", async function () {
    expect(await xade.name()).to.equal("Xade");
    expect(await xade.symbol()).to.equal("XADE");
    expect(await xade.totalSupply()).to.equal(INITIAL_MINT_AMOUNT);
    expect(await xade.balanceOf(dev.address)).to.equal(INITIAL_MINT_AMOUNT);
    expect(await xade.minter()).to.equal(dev.address);
  });

  it("Should allow changing the minter address", async function () {
    await xade.connect(dev).setMinter(alice.address);
    expect(await xade.minter()).to.equal(alice.address);
  });

  it("Should not allow changing the minter address by non-minter", async function () {
    await expect(xade.connect(alice).setMinter(bob.address)).to.be.revertedWith(
      "Xade::setMinter: only the minter can change the minter address"
    );
  });
  it("Should allow minting tokens by the minter", async () => {
    const [owner, addr1] = await ethers.getSigners();
    const minimumTimeBetweenMints = await xade.minimumTimeBetweenMints();

    // Increase the time to allow minting
    await time.increase(minimumTimeBetweenMints);

    await xade.connect(owner).mint(addr1.address, 1000);

    const addr1Balance = await xade.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(1000);
  });

  it("Should not allow minting token before one year has passed", async function () {
    const mintAmount = ethers.utils.parseEther("1000");
    await expect(
      xade.connect(dev).mint(bob.address, mintAmount)
    ).to.be.revertedWith("Xade::mint: minting not allowed yet");
  });

  it("Should not allow minting tokens by non-minter", async function () {
    const mintAmount = ethers.utils.parseEther("1000");
    await expect(
      xade.connect(alice).mint(bob.address, mintAmount)
    ).to.be.revertedWith("Xade::mint: only the minter can mint");
  });

  it("Should mint the annual inflation", async function () {
    // Move forward in time
    const minimumTimeBetweenMints = await xade.minimumTimeBetweenMints();

    // Increase the time to allow minting
    await time.increase(minimumTimeBetweenMints);

    const initialSupply = await xade.totalSupply();
    await xade.connect(dev).mintAnnualInflation(alice.address);
    const newSupply = await xade.totalSupply();
    const expectedInflation = initialSupply.mul(7).div(100);

    expect(newSupply.sub(initialSupply)).to.equal(expectedInflation);
    expect(await xade.balanceOf(alice.address)).to.equal(expectedInflation);
  });

  it("Should not allow minting annual inflation before one year has passed", async function () {
    await expect(
      xade.connect(dev).mintAnnualInflation(alice.address)
    ).to.be.revertedWith("Xade::mintAnnualInflation: minting not allowed yet");
  });

  it("Should not allow minting annual inflation tokens by non-minter", async function () {
    await expect(
      xade.connect(alice).mintAnnualInflation(bob.address)
    ).to.be.revertedWith("Xade::mintAnnualInflation: only the minter can mint");
  });

  it("Should not allow to call mint after calling the minting annual inflation of tokens", async function () {
    // Move forward in time
    const minimumTimeBetweenMints = await xade.minimumTimeBetweenMints();

    // Increase the time to allow minting
    await time.increase(minimumTimeBetweenMints);

    // Mint the annual inflation
    await xade.connect(dev).mintAnnualInflation(alice.address);

    const mintAmount = ethers.utils.parseEther("1000");

    // Attempt to call mint after minting the annual inflation (should revert)
    await expect(
      xade.connect(dev).mint(bob.address, mintAmount)
    ).to.be.revertedWith("Xade::mint: minting not allowed yet");
  });
});
