// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../base/BaseMember.sol";
import "../interfaces/ICertificateUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title CertifierUpgradeable contract in a supply chain.
 * @notice Implementation of an upgradeable contract that represents the tasks of a certifier in the olive
 *     oil supply chain.
 */
contract CertifierUpgradeable is Initializable, UUPSUpgradeable, BaseMember, OwnableUpgradeable {
    /// @dev ICertificateUpgradeable reference used to interact with the certificate
    address private _certificate;

    function __CertifierUpgradeable_init(string memory name_, address certificate_) internal onlyInitializing {
        __UUPSUpgradeable_init_unchained();
        __BaseMember_init_unchained(name_);
        __Ownable_init_unchained();
        __CertifierUpgradeable_init_unchained(certificate_);
    }

    function __CertifierUpgradeable_init_unchained(address certificate_) internal onlyInitializing {
        _certificate = certificate_;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @dev See {ICertificateUpgradeable-certifyToken}
    function certifyToken(bytes32 certificateId, address tokenAddress, bytes32 tokenTypeId) external onlyOwner {
        ICertificateUpgradeable(_certificate).certifyToken(certificateId, tokenAddress, tokenTypeId);
    }

    /// @dev See {ICertificateUpgradeable-certifyBatch}
    function certifyBatch(
        bytes32[] calldata certificateIds,
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenTypeIds
    ) external onlyOwner {
        ICertificateUpgradeable(_certificate).certifyBatch(certificateIds, tokenAddresses, tokenTypeIds);
    }

    /// @dev See {ICertificateUpgradeable-isCertified}
    function isCertified(
        bytes32 certificateId,
        address tokenAddress,
        bytes32 tokenTypeId
    ) external view returns (bool) {
        return ICertificateUpgradeable(_certificate).isCertified(certificateId, tokenAddress, tokenTypeId);
    }

    /// @dev See {ICertificateUpgradeable-certificatesOf}
    function certificatesOf(address tokenAddress, bytes32 tokenTypeId) external view returns (bytes32[] memory) {
        return ICertificateUpgradeable(_certificate).certificatesOf(tokenAddress, tokenTypeId);
    }

    /// @dev See {ICertificateUpgradeable-certificatesOfBatch}
    function certificatesOfBatch(
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenIds
    ) public view returns (bytes32[][] memory) {
        return ICertificateUpgradeable(_certificate).certificatesOfBatch(tokenAddresses, tokenIds);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[49] private __gap;
}
