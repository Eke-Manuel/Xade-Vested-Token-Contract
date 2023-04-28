// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {
    ERC20PresetMinterPauser
} from "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract ERC20Mock is ERC20PresetMinterPauser("ERC20Mock", "ERM") {
    constructor() {
        mint(msg.sender, 100000000e18);
    }

}
