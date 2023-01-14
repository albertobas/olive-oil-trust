// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/roles/BottleManufacturerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Member Bottle Company contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from BottleManufacturerUpgradeable.
 */
contract BottleCompany is Initializable, BottleManufacturerUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The independent token address.
     * @param escrow_ The commercial units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __BottleManufacturerUpgradeable_init('Bottle Company', token, escrow_);
    }
}
