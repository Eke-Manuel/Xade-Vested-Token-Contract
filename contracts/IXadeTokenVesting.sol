// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IXadeTokenVesting {

    function createSalesVestingSchedule(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        bool _revocable,
        uint256 _amount
    ) external;
}