// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/roles/OliveGrowerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Member Olive Grower One contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from OliveGrowerUpgradeable.
 */
contract OliveGrowerOne is Initializable, OliveGrowerUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The independent token address.
     * @param escrow_ The agricultural units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __OliveGrowerUpgradeable_init('Olive Grower One', token, escrow_);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
