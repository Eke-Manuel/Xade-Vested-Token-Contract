// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IXadeTokenVesting } from "./IXadeTokenVesting.sol";

contract XadeTokenSales is Ownable, ReentrancyGuard {
    ERC20 public token; // USDC
    IXadeTokenVesting public vestingContract;

    event XadeTokenPurchased(uint256 amount);

    /**
     * @dev Constructor
     * @param _tokenAddr Payment token address
     * @param _vestingContract Address of vesting contract
     */
    constructor(address _tokenAddr, address _vestingContract) {
        require(_tokenAddr != address(0),"zero addr");
        require(_vestingContract != address(0),"zero addr");
        token = ERC20(_tokenAddr);
        vestingContract = IXadeTokenVesting(_vestingContract);
    }

    /**
     * @dev This function is called for plain Ether transfers, i.e. for every call with empty calldata.
     */
    receive() external payable {}

    /**
     * @dev Fallback function is executed if none of the other functions match the function
     * identifier or no data was provided with the function call.
     */
    fallback() external payable {}

    /**
     * @notice Purchase the specified amount of tokens
     * @param _recipient account to receive the tokens
     * @param _value the value of tokens to be purchased in USD
     */
    function purchaseTokens(address _recipient, uint256 _value) external nonReentrant {
        require(_recipient != address(0), "zero addr");
        require(_value != 0, "no amount entered");

        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _value);
        uint256 price = _getTokenPrice(_value);
        uint256 amountOfTokens = _value / price; 

        _createVestingSchedule(_recipient, amountOfTokens);

        emit XadeTokenPurchased(amountOfTokens);
    }

    /**
     * @notice Withdraw the specified amount if possible.
     * @param _amount the amount to withdraw
     */
    function withdraw(uint256 _amount) external nonReentrant onlyOwner {
        require(balance() >= _amount, "Over token balance");
        SafeERC20.safeTransfer(token, msg.sender, _amount);
    }

    /**
     * @dev Returns the balance of Xade tokens in the contract.
     */
    function balance() public view returns(uint256) {
        return  token.balanceOf(address(this));
    }

    function _createVestingSchedule(
        address _recipient, 
        uint256 _amountOfTokens
    ) internal {
        vestingContract.createSalesVestingSchedule(
        _recipient,
        block.timestamp,
        0,
        1 days * 270, // 9 months(Assuming 30 day months)
        23328000, 
        false,
        _amountOfTokens);
    }

    /**
     * @dev Returns price of token based on value of purchase
     */
    function _getTokenPrice(uint256 _value) private pure returns(uint256 price) {
        if (_value < 200e18) {
            price = 125e14;
        } else if (200e18 <= _value && _value < 2000e18) {
            price = 1e16;
        } else if (2000e18 <= _value && _value < 20000e18) {
            price = 9e15;
        } else if (20000e18 <= _value && _value < 100000e18) {
            price = 75e14;
        } else {
            price = 6e15;
        }
    }
}
