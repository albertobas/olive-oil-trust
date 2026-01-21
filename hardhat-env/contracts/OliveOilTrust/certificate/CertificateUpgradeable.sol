// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../interfaces/IBaseToken.sol";
import "../interfaces/ICertificateUpgradeable.sol";
import "../libraries/Constants.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/**
 * @title CertificateUpgradeable base contract.
 * @dev Implementation of a certificate contract. The main purpose of this contract is to provide
 *     the owner of the certificate with the means to certify a token or multiple tokens, check if
 *     the tokens are certified and retrieve the certificates of the tokens.
 */
contract CertificateUpgradeable is Initializable, UUPSUpgradeable, OwnableUpgradeable, ICertificateUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @dev A counter to provide certificate ids
    CountersUpgradeable.Counter private _certificateIdsCounter;

    /// @dev Base URI of the certificates
    string private _uri;

    /// @dev Mapping from certificate id to certified boolean
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) private _certificateBool;

    /// @dev Mapping from token address to certificate ids
    mapping(address => mapping(uint256 => uint256[])) private _certificates;

    /// @dev Mapping from bytes certificate id to int certificate id
    mapping(bytes32 => uint256) internal _intId;

    /// @dev Mapping from int certificate id to bytes certificate id
    mapping(uint256 => bytes32) private _bytesId;

    function __CertificateUpgradeable_init(string memory uri_) internal onlyInitializing {
        __UUPSUpgradeable_init_unchained();
        __Ownable_init_unchained();
        __CertificateUpgradeable_init_unchained(uri_);
    }

    function __CertificateUpgradeable_init_unchained(string memory uri_) internal onlyInitializing {
        _uri = uri_;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @inheritdoc ICertificateUpgradeable
    function certifyToken(bytes32 certificateId, address tokenAddress, bytes32 tokenTypeId) external onlyOwner {
        _checkAddress(tokenAddress);
        (uint256 intCertificateId, uint256 intTokenTypeId) = _getIds(certificateId, tokenAddress, tokenTypeId);
        _certify(intCertificateId, tokenAddress, intTokenTypeId);
        emit TokenCertified(msg.sender, certificateId, tokenAddress, tokenTypeId);
    }

    /// @inheritdoc ICertificateUpgradeable
    function certifyBatch(
        bytes32[] calldata certificateIds,
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenTypeIds
    ) external onlyOwner {
        uint256 len = certificateIds.length;
        if (len != tokenAddresses.length || len != tokenTypeIds.length || len == 0 || len > Constants.MAX_BATCH_SIZE) {
            revert CertificateInvalidArray();
        }
        uint256[] memory intCertificatesIds = new uint256[](len);
        uint256[] memory intTokensTypeIds = new uint256[](len);
        for (uint256 i = 0; i < len; ) {
            _checkAddress(tokenAddresses[i]);
            (uint256 intCertificateId, uint256 intTokenTypeId) = _getIds(
                certificateIds[i],
                tokenAddresses[i],
                tokenTypeIds[i]
            );
            intCertificatesIds[i] = intCertificateId;
            intTokensTypeIds[i] = intTokenTypeId;
            _certify(intCertificateId, tokenAddresses[i], intTokenTypeId);
            unchecked {
                i++;
            }
        }
        emit BatchCertified(msg.sender, certificateIds, tokenAddresses, tokenTypeIds);
    }

    /// @inheritdoc ICertificateUpgradeable
    function isCertified(
        bytes32 certificateId,
        address tokenAddress,
        bytes32 tokenTypeId
    ) external view returns (bool) {
        _checkAddress(tokenAddress);
        uint256 intCertificateId = _intId[certificateId];
        uint256 intTokenTypeId = IBaseToken(tokenAddress).bytesToIntTokenTypeId(tokenTypeId);
        return _isCertified(intCertificateId, tokenAddress, intTokenTypeId);
    }

    /// @inheritdoc ICertificateUpgradeable
    function certificatesOf(address tokenAddress, bytes32 tokenTypeId) external view returns (bytes32[] memory) {
        return _certificatesOf(tokenAddress, tokenTypeId);
    }

    /// @inheritdoc ICertificateUpgradeable
    function certificatesOfBatch(
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenTypeIds
    ) external view returns (bytes32[][] memory certificates_) {
        uint256 len = tokenAddresses.length;
        if (len != tokenTypeIds.length || len == 0 || len > Constants.MAX_BATCH_SIZE) {
            revert CertificateInvalidArray();
        }
        certificates_ = new bytes32[][](len);
        for (uint256 i = 0; i < len; ) {
            certificates_[i] = _certificatesOf(tokenAddresses[i], tokenTypeIds[i]);
            unchecked {
                i++;
            }
        }
    }

    /// @inheritdoc ICertificateUpgradeable
    function uri() external view returns (string memory) {
        return _uri;
    }

    function _certificatesOf(
        address tokenAddress,
        bytes32 tokenTypeId
    ) private view returns (bytes32[] memory certificates_) {
        _checkAddress(tokenAddress);
        // slither-disable-next-line calls-loop
        uint256 intTokenTypeId = IBaseToken(tokenAddress).bytesToIntTokenTypeId(tokenTypeId);
        uint256 len = _certificates[tokenAddress][intTokenTypeId].length;
        certificates_ = new bytes32[](len);
        for (uint256 i = 0; i < len; i++) {
            uint256 intCertificateId = _certificates[tokenAddress][intTokenTypeId][i];
            certificates_[i] = (_bytesId[intCertificateId]);
        }
    }

    function _certify(uint256 certificateId, address tokenAddress, uint256 tokenTypeId) private {
        if (_isCertified(certificateId, tokenAddress, tokenTypeId)) {
            revert CertificateTokenAlreadyCertified();
        }
        _certificateBool[certificateId][tokenAddress][tokenTypeId] = true;
        _certificates[tokenAddress][tokenTypeId].push(certificateId);
    }

    function _getIds(
        bytes32 certificateId,
        address tokenAddress,
        bytes32 tokenTypeId
    ) private returns (uint256 intCertificateId, uint256 intTokenTypeId) {
        // slither-disable-next-line calls-loop
        intTokenTypeId = IBaseToken(tokenAddress).bytesToIntTokenTypeId(tokenTypeId);
        if (_intId[certificateId] != 0) {
            intCertificateId = _intId[certificateId];
        } else {
            if (_certificateIdsCounter.current() == 0) {
                _certificateIdsCounter.increment();
            }
            intCertificateId = _certificateIdsCounter.current();
            _certificateIdsCounter.increment();
            _intId[certificateId] = intCertificateId;
            _bytesId[intCertificateId] = certificateId;
        }
    }

    function _isCertified(
        uint256 certificateId,
        address tokenAddress,
        uint256 tokenTypeId
    ) private view returns (bool) {
        return _certificateBool[certificateId][tokenAddress][tokenTypeId];
    }

    function _checkAddress(address token) private view {
        if (token == address(0) || token.code.length == 0) revert CertificateInvalidAddress();
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[44] private __gap;
}
