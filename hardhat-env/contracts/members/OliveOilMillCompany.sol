// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/roles/OliveOilMillUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Member Olive Oil Mill Company contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from OliveGrowerUpgradeable.
 */
contract OliveOilMillCompany is Initializable, OliveOilMillUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The dependent token address.
     * @param escrow_ The commercial units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __OliveOilMillUpgradeable_init('Olive Oil Mill Company', token, escrow_);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
