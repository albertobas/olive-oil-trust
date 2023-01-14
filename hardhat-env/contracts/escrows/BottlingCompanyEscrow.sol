// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/escrows/IndustrialUnitsEscrowUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Bottling Company escrow contract.
 * @notice Implementation of an upgradeable contract of an industrial units escrow in
 *     Olive Oil Trust. This contract inherits from IndustrialUnitsEscrowUpgradeable.
 */
contract BottlingCompanyEscrow is Initializable, IndustrialUnitsEscrowUpgradeable {
    /// @dev Initialize function
    function initialize() external initializer {
        __IndustrialUnitsEscrowUpgradeable_init();
    }
}
