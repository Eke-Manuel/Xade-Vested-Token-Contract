# Xade Token & Xade Vested Token Contract

This repo contains the Xade ERC-20 token (`Xade.sol`) and another smart contract called the `XadeTokenVesting.sol` which is for the vesting for the Xade ERC-20 Tokens

# Xade Token

The Xade Token is a custom ERC20 token built on the Ethereum blockchain. The primary purpose of the token is to serve as a utility token in the Xade ecosystem.

## Features

1. **Initial Minting**: The contract mints 1 billion Xade tokens at the time of deployment, which are assigned to the deployer's address.

2. **Minter Role**: The contract has a specific role for a minter, which is initially set to the deployer's address. The minter has the ability to mint new tokens and change the minter's address.

3. **Minting Restrictions**: The minting of new tokens is restricted by a time-lock mechanism and a cap on the percentage of the total supply that can be minted at each minting event.

   - **Time-lock**: After deployment, minting is allowed only after a minimum time has passed, which is set to 1 year (365 days) in the contract. After each successful mint, the time-lock is reset, preventing further minting until another year has passed.

   - **Mint Cap**: The minter can only mint a maximum of 7% of the current total supply at each minting event. This cap serves as an inflation control mechanism, ensuring that the token supply does not grow too rapidly.

4. **Annual Inflation Minting**: The minter can also mint the annual inflation of tokens, which is calculated as 7% of the current total supply. This feature allows for a predictable inflation rate and ensures the token supply keeps up with the ecosystem's growth.

## Example Usage

### Minting Tokens

```js
const mintAmount = ethers.utils.parseEther("100");
await xade.connect(minter).mint(destinationAddress, mintAmount);
```

### Minting a set number of tokens

```js
const mintAmount = ethers.utils.parseEther("100");
await xade.connect(minter).mint(destinationAddress, mintAmount);
```

### Minting Annual Inflation (this will likely to be used)

```js
await xade.connect(minter).mintAnnualInflation(destinationAddress);
```

### Changing the Minter

```js
await xade.connect(minter).setMinter(newMinterAddress);
```

## Tests

The Xade Token contract includes a test suite that covers the main functionality of the contract. To run the tests, use the following command:

```bash
npx hardhat test
```

The tests ensure that the contract behaves as expected, including proper minting of tokens, respecting the time-lock mechanism, and adhering to the mint cap.

# Xade Token Vesting

Xade Token Vesting is a smart contract that enables vesting of tokens for a specific wallet over a specified duration.

## Usage

### Adding a Vesting Schedule

A vesting schedule can be added for a specific wallet by calling the addVestingSchedule function with the following parameters:

`wallet` (address): The address of the wallet to which the vesting schedule is to be added.
`amount` (uint256): The total amount of tokens to be vested for the wallet.
`start` (uint256): The timestamp from which the vesting schedule is to start.
`duration` (uint256): The duration of the vesting schedule.
`cliff` (uint256): The time period from which the tokens can start vesting.

### Withdrawing Vesting Tokens

Tokens can be withdrawn from a vesting schedule by calling the `withdraw` function with the wallet address as parameter.

### Get Vesting Schedule Details

The details of a vesting schedule can be fetched by calling the `getVestingSchedule` function with the wallet address as parameter.

## Tests

The Xade Token Vesting contract includes a test suite that covers the main functionality of the contract. To run the tests, use the following command:

```bash
npx hardhat test
```

# Hardhat Commands

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# Credits

Thank you to: https://github.com/abdelhamidbakhta/token-vesting-contracts
