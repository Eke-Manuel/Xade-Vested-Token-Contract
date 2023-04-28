const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("XadeTokenSales", function() {
    let vestingContract;
    let XadeToken;
    let XadeTokenSales;
    let USDC;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    function getExpectedAmount(value) {
        let price;
        if (value < 200e18) {
            price = 125e14;
        } else if (200e18 <= value && value < 2000e18) {
            price = 1e16;
        } else if (2000e18 <= value && value < 20000e18) {
            price = 9e15;
        } else if (20000e18 <= value && value < 100000e18) {
            price = 75e14;
        } else {
            price = 6e15;
        }
        const amount = value / price;
        return Math.round(amount)
    }

    beforeEach(async function () {
        [owner, addr1, addr2, ...addr3] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Xade")
        XadeToken = await Token.deploy();
        await XadeToken.deployed();

        const VestingContract = await ethers.getContractFactory("MockTokenVesting");
        vestingContract = await VestingContract.deploy(XadeToken.address);
        await vestingContract.deployed();

        const usdc = await ethers.getContractFactory("ERC20Mock");
        USDC = await usdc.deploy();
        await USDC.deployed();

        const salesContract = await ethers.getContractFactory("XadeTokenSales");
        XadeTokenSales = await salesContract.deploy(USDC.address, vestingContract.address);
        await XadeTokenSales.deployed();
    });

    describe("State variables", async function () {
        it("Should set token correctly", async function () {
            expect(await XadeTokenSales.token()).to.equal(USDC.address);
        });
        it("Should set vesting contract correctly", async function () {
            expect(await XadeTokenSales.vestingContract()).to.equal(vestingContract.address);
        });
    });

    describe("Token Purchase", async function () {
        beforeEach(async function () {
            const VestingContract = await ethers.getContractFactory("MockTokenVesting");
            vestingContract = await VestingContract.deploy(XadeToken.address);
            await vestingContract.deployed();

            await XadeToken.transfer(vestingContract.address, ethers.utils.parseEther("10000000"));

            const usdc = await ethers.getContractFactory("ERC20Mock");
            USDC = await usdc.deploy();
            await USDC.deployed();
    
            const salesContract = await ethers.getContractFactory("XadeTokenSales");
            XadeTokenSales = await salesContract.deploy(USDC.address, vestingContract.address);
            await XadeTokenSales.deployed();

            await vestingContract.setSalesContract(XadeTokenSales.address);
        });

        it("Should revert if zero address in entered", async function () {
            const addrZero = "0x0000000000000000000000000000000000000000";
            await expect(XadeTokenSales.purchaseTokens(addrZero, 100)).to.be.revertedWith("zero addr");
        });
        it("Should revert if value param is zero", async function () {
            await expect(XadeTokenSales.purchaseTokens(addr1.address, 0)).to.be.revertedWith("no amount entered");
        });
        it("Should transfer tokens successfully", async function () {
            await USDC.approve(XadeTokenSales.address, ethers.utils.parseEther("1000"));
            await XadeTokenSales.purchaseTokens(addr1.address, ethers.utils.parseEther("1000"));
            expect(await USDC.balanceOf(XadeTokenSales.address)).to.be.equal(ethers.utils.parseEther("1000"));
        });
        it("Should create vesting schedule for buyer", async function () {
            const vestingScheduleId =
            await vestingContract.computeVestingScheduleIdForAddressAndIndex(
              addr2.address,
              0
            );
            await USDC.approve(XadeTokenSales.address, ethers.utils.parseEther("1000"));
            await XadeTokenSales.purchaseTokens(addr2.address, ethers.utils.parseEther("1000"));
            const vestingSchedule = await  vestingContract.getVestingSchedule(vestingScheduleId);
            expect(vestingSchedule.initialized).to.equal(true);
            expect(vestingSchedule.beneficiary).to.equal(addr2.address);
            expect(vestingSchedule.revocable).to.equal(false);
        });
        it("Should emit event", async function () {
            await USDC.approve(XadeTokenSales.address, ethers.utils.parseEther("1000"));
            await expect(XadeTokenSales.purchaseTokens(addr2.address, ethers.utils.parseEther("1000"))).to.emit(XadeTokenSales, "XadeTokenPurchased").withArgs(100000);
        });
        it("Should use correct price to calculate amount", async function () {
            const vestingScheduleId =
            await vestingContract.computeVestingScheduleIdForAddressAndIndex(
              addr2.address,
              0
            );
            await USDC.approve(XadeTokenSales.address, ethers.utils.parseEther("3000"));
            await XadeTokenSales.purchaseTokens(addr2.address, ethers.utils.parseEther("3000"));
            const vestingSchedule = await vestingContract.getVestingSchedule(vestingScheduleId);
            totalAmount = getExpectedAmount(ethers.utils.parseEther("3000"));
            expect(vestingSchedule.amountTotal).to.equal(totalAmount);
        });
        it("Should get correct balance of contract", async function () {
            await USDC.approve(XadeTokenSales.address, ethers.utils.parseEther("1000"));
            await XadeTokenSales.purchaseTokens(addr2.address, ethers.utils.parseEther("1000"));
            expect(await XadeTokenSales.balance()).to.be.equal(ethers.utils.parseEther("1000"));
        });
    });

    describe("Withdrawal", async function () {
        it("Should allow owner withdrawal", async function () {
            await USDC.transfer(XadeTokenSales.address, 1000);
            expect(await XadeTokenSales.balance()).to.be.equal(1000);
            await XadeTokenSales.withdraw(900);
            expect(await XadeTokenSales.balance()).to.be.equal(100);
        });
        it("Only owner can withdraw", async function () {
            await USDC.transfer(XadeTokenSales.address, 1000);
            await expect(XadeTokenSales.connect(addr1).withdraw(200)).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Should revert when amount > balance", async function () {
            await USDC.transfer(XadeTokenSales.address, 1000);
            await expect(XadeTokenSales.withdraw(3000)).to.be.revertedWith("Over token balance");
        });
    });
})
