// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/roles/CertifierUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Member Certifier Company contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from CertifierUpgradeable.
 */
contract CertifierCompany is Initializable, CertifierUpgradeable {
    /**
     * @dev Initialize function.
     * @param certificate The certificate address.
     */
    function initialize(address certificate) external initializer {
        __CertifierUpgradeable_init('Certifier Company', certificate);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
