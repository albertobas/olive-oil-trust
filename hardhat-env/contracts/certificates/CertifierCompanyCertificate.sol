// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../OliveOilTrust/certificate/CertificateUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title Certifier Company certificate contract.
 * @notice Implementation of an upgradeable contract of a certificate in Olive Oil Trust.
 *     This contract inherits from CertificateUpgradeable.
 */
contract CertifierCompanyCertificate is Initializable, CertificateUpgradeable {
    /**
     * @dev Initialize function.
     * @param uri_ Base URI of the certificate.
     */
    function initialize(string memory uri_) external initializer {
        __CertificateUpgradeable_init(uri_);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
