// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Xade is ERC20 {
    /// @notice Initial mint amount
    uint256 public constant INITIAL_MINT_AMOUNT = 1_000_000_000e18; // 1 billion Xade

    /// @notice Address which may mint new tokens
    address public minter;

    /// @notice The timestamp after which minting may occur
    uint public mintingAllowedAfter;

    /// @notice Minimum time between mints
    uint32 public constant minimumTimeBetweenMints = 1 days * 365;

    /// @notice Cap on the percentage of totalSupply that can be minted at each mint (inflation rate)
    uint8 public constant mintCap = 7;

    /// @notice An event thats emitted when the minter address is changed
    event MinterChanged(address minter, address newMinter);

    constructor() ERC20("Xade", "XADE") {
        _mint(msg.sender, INITIAL_MINT_AMOUNT);
        minter = msg.sender;
        mintingAllowedAfter = block.timestamp + minimumTimeBetweenMints;
    }

    /**
     * @notice Change the minter address
     * @param minter_ The address of the new minter
     */
    function setMinter(address minter_) external {
        require(
            msg.sender == minter,
            "Xade::setMinter: only the minter can change the minter address"
        );
        emit MinterChanged(minter, minter_);
        minter = minter_;
    }

    /**
     * @notice Mint new tokens and pass a raw amount to mint a percise number of tokens
     * @param dst The address of the destination account
     * @param rawAmount The number of tokens to be minted
     */
    function mint(address dst, uint256 rawAmount) external {
        require(msg.sender == minter, "Xade::mint: only the minter can mint");
        require(
            block.timestamp >= mintingAllowedAfter,
            "Xade::mint: minting not allowed yet"
        );
        require(
            dst != address(0),
            "Xade::mint: cannot transfer to the zero address"
        );

        // record the mint
        mintingAllowedAfter = block.timestamp + minimumTimeBetweenMints;

        // mint the amount
        require(
            rawAmount <= (totalSupply() * mintCap) / 100,
            "Xade::mint: exceeded mint cap"
        );
        _mint(dst, rawAmount);
    }

    /**
     * @notice Mint the annual inflation of the tokens
     * @param dst The address of the destination account
     */
    function mintAnnualInflation(address dst) external {
        require(
            msg.sender == minter,
            "Xade::mintAnnualInflation: only the minter can mint"
        );
        require(
            block.timestamp >= mintingAllowedAfter,
            "Xade::mintAnnualInflation: minting not allowed yet"
        );
        require(
            dst != address(0),
            "Xade::mintAnnualInflation: cannot transfer to the zero address"
        );

        // record the mint
        mintingAllowedAfter = block.timestamp + minimumTimeBetweenMints;

        // calculate the annual inflation amount
        uint256 inflationAmount = (totalSupply() * mintCap) / 100;

        // mint the inflation amount
        _mint(dst, inflationAmount);
    }
}
