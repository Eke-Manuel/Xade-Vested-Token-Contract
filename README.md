# Xade Token & Xade Vested Token Contract

This repo contains the Xade ERC-20 token (`Xade.sol`) and another smart contract called the `XadeTokenVesting.sol` which is for the vesting for the Xade ERC-20 Tokens. It also contains the sale contract for Xade tokens - `XadeTokenSales.sol`, which automatically vests the tokens after purchase.

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

### View on Polyscan:
```bash
0x539259b8513d677B51fA9274fB7c81a69ac35d84
```


# Xade Token Vesting

XadeTokenVesting is a smart contract that enables vesting of tokens for a specific wallet over a specified duration.

## Usage

### Adding a Vesting Schedule:

A vesting schedule can be added for a specific wallet by calling the `createVestingSchedule` function with the following parameters:

`beneficiary` (address): The address of the wallet to which the vesting schedule is to be added.
`start` (uint256): The timestamp from which the vesting schedule is to start.
`cliff` (uint256): The time period from which the tokens can start vesting.
`duration` (uint256): The duration of the vesting schedule.
`slicePeriodSeconds` (uint256): Duration of a slice period for the vesting in seconds.
`revocable` (bool): Whether the vesting is revocable or not.
`amount` (uint256): Total amount of tokens to be released at the end of the vesting.

The `createSalesVestingSchedule` function works exactly the same as the above function except that it is only callable from the sales contract.




### Withdrawing Vested Tokens at the end of the vesting period:

Tokens can be withdrawn from a vesting schedule by calling the `release` function with the vesting schedule ID and amount as parameters. To get your vesting schedule ID, call the `computeVestingScheduleIdForAddressAndIndex` function with your address and index of the schedule as parameters.
The index can be 0 to n, where n is the number of vesting schedules associated with the address minus 1.
The number of vesting schedules for a particular address can be gotten by calling the `getVestingSchedulesCountByBeneficiary` function with the address as the parameter. 

### Get Vesting Schedule Details:

The details of a vesting schedule can be fetched by calling the `getVestingSchedule` function with the schedule ID as as parameter.

### View on Polyscan:
```bash
0x762d10549A7Ed1a502d6dF2A50C2fD70dAfe9744
```



# XadeTokenSales

XadeTokenSales is a smart contract that enables purchase of Xade tokens which will automatically be vested for a period of 9 months. The token price will vary based on the value of the purchase as follows:

Less than $200: `$0.0125` per token

$200 to $2000: `$0.010` per token

$2000 to $20000: `$0.009` per token

$20,000 to $100,000: `$0.0075` per token 

$100,000 or more: `$0.006` per token

## Usage

### Token Purchase
To buy Xade tokens, call the `purchaseTokens` function with the beneficiary address and value of purchase(in USD) as parameters.
Only purchases using USDC is supported for now.

Calling this function will automatically call the `createSalesVestingSchedule` function of the `XadeTokenVesting` contract described above to create a vesting schedule for the beneficiary. The vesting schedule created by this function is not revocable and has a duration of 9 months(assuming 30-day months). 

### View on Polyscan:
```bash
0xa46D163831f42d3c5d30A032Ab9AaB4813d46fDb
```

# Tests

The repository includes a test suite that contains comprehensive tests of the functionality of all the contracts. To run the tests, use the following command:

```bash
yarn hardhat test
```


# Credits

Thank you to: https://github.com/abdelhamidbakhta/token-vesting-contracts
