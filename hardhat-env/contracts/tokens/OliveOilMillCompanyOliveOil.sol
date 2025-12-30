// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/tokens/DependentTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Olive Oil Mill Company olive oil contract.
 * @notice Implementation of an upgradeable contract of a dependent token in
 *     Olive Oil Trust. This contract inherits from DependentTokenUpgradeable.
 */
contract OliveOilMillCompanyOliveOil is Initializable, DependentTokenUpgradeable {
    /**
     * @dev Initialize function.
     * @param uri_ Base URI of the token.
     */
    function initialize(string memory uri_) external initializer {
        __DependentTokenUpgradeable_init(uri_);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
