// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/roles/BottlingPlantUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Member Bottling Company contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from BottlingPlantUpgradeable.
 */
contract BottlingCompany is Initializable, BottlingPlantUpgradeable {
    /**
     * @dev Initialize function.
     * @param dependentToken The dependent token address.
     * @param industrialUnitToken The industrial unit token address.
     * @param escrow_ The industrial units escrow address.
     */
    function initialize(
        address dependentToken,
        address industrialUnitToken,
        address escrow_
    ) external initializer {
        __BottlingPlantUpgradeable_init('Bottling Company', dependentToken, industrialUnitToken, escrow_);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
