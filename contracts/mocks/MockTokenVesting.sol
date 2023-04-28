pragma solidity 0.8.19;

import "../XadeTokenVesting.sol";

/**
 * @title MockTokenVesting
 * WARNING: use only for testing and debugging purpose
 */
contract MockTokenVesting is XadeTokenVesting {
    uint256 mockTime = 0;

    constructor(address token_) XadeTokenVesting(token_) {}

    function setCurrentTime(uint256 _time) external {
        mockTime = _time;
    }

    function getCurrentTime() internal view virtual override returns (uint256) {
        return mockTime;
    }
}
