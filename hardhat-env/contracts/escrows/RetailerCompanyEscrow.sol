// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../OliveOilTrust/escrows/CommercialUnitsEscrowUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title Retailer Company escrow contract.
 * @notice Implementation of an upgradeable contract of a commercial units escrow in
 *     Olive Oil Trust. This contract inherits from CommercialUnitsEscrowUpgradeable.
 */
contract RetailerCompanyEscrow is Initializable, CommercialUnitsEscrowUpgradeable {
    /// @dev Initialize function
    function initialize() external initializer {
        __CommercialUnitsEscrowUpgradeable_init();
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
