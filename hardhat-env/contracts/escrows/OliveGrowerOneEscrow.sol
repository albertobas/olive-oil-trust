// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../OliveOilTrust/escrows/AgriculturalEscrowUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title Olive Grower One escrow contract.
 * @notice Implementation of an upgradeable contract of an agricultural escrow in
 *     Olive Oil Trust. This contract inherits from AgriculturalEscrowUpgradeable.
 */
contract OliveGrowerOneEscrow is Initializable, AgriculturalEscrowUpgradeable {
    /// @dev Initialize function
    function initialize() external initializer {
        __AgriculturalEscrowUpgradeable_init();
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
