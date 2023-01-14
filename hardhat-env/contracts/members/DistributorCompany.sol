// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/roles/DistributorUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Member Distributor Company contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from DistributorUpgradeable.
 */
contract DistributorCompany is Initializable, DistributorUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The industrial unit token address.
     * @param escrow_ The industrial units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __DistributorUpgradeable_init('Distributor Company', token, escrow_);
    }
}
