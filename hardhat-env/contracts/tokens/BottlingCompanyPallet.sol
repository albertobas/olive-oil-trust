// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/tokens/IndustrialUnitTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Bottling Company pallet contract.
 * @notice Implementation of an upgradeable contract of an industrial unit token in
 *     Olive Oil Trust. This contract inherits from IndustrialUnitTokenUpgradeable.
 */
contract BottlingCompanyPallet is Initializable, IndustrialUnitTokenUpgradeable {
    /**
     * @dev Initialize function.
     * @param uri_ Base URI of the token.
     */
    function initialize(string memory uri_) external initializer {
        __IndustrialUnitTokenUpgradeable_init(uri_);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
