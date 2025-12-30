// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/BaseToken.sol';
import '../interfaces/IDependentTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title DependentTokenUpgradeable contract.
 * @dev Implementation of a contract that aims to represent a dependent token in the supply chain, i.e.
 *     a token that does require other token/s to be minted.
 *     Inherits from BaseToken, see {BaseToken}.
 *     It requires a base URI.
 */
contract DependentTokenUpgradeable is Initializable, BaseToken, OwnableUpgradeable, IDependentTokenUpgradeable {
    /// @dev Struct that gathers instruction about a single dependent token
    struct DependentTokenInstructions {
        address[] instructedTokenAddresses;
        bytes32[] instructedTokenTypeIds;
        uint256[] instructedTokenAmounts;
    }

    /// @dev Mapping from token id to IDependentTokenUpgradeable.DependentTokenInstructions struct
    mapping(uint256 => DependentTokenInstructions) private _tokenInstructions;

    /// @dev Mapping from token type id to boolean that indicates wether the type has instructions or not
    mapping(uint256 => mapping(bytes32 => bool)) private _isTypeInstructed;

    function __DependentTokenUpgradeable_init(string memory uri_) internal onlyInitializing {
        __ERC1155_init_unchained(uri_);
        __Ownable_init_unchained();
        __DependentTokenUpgradeable_init_unchained();
    }

    function __DependentTokenUpgradeable_init_unchained() internal onlyInitializing {}

    /// @inheritdoc IDependentTokenUpgradeable
    function setTokenTypeInstructions(
        bytes32 tokenTypeId,
        address[] calldata instructedTokenAddresses,
        bytes32[] calldata instructedTokenTypeIds,
        uint256[] calldata instructedTokenAmounts
    ) external onlyOwner {
        if (_intTokenTypeId[tokenTypeId] != 0) {
            revert DependentTokenDuplicatedTokenTypeId();
        }
        uint256 tokenTypeId_ = _generateIntTokenTypeId(tokenTypeId);
        _setInstructions(tokenTypeId_, instructedTokenAddresses, instructedTokenTypeIds, instructedTokenAmounts);
        emit TokenTypeInstructionsSet(
            msg.sender,
            tokenTypeId,
            instructedTokenAddresses,
            instructedTokenTypeIds,
            instructedTokenAmounts
        );
    }

    /// @inheritdoc IDependentTokenUpgradeable
    function setTokenTypesInstructions(
        bytes32[] calldata tokenTypeIds,
        address[][] calldata instructedTokenAddresses,
        bytes32[][] calldata instructedTokenTypeIds,
        uint256[][] calldata instructedTokenAmounts
    ) external onlyOwner {
        if (
            instructedTokenAddresses.length != instructedTokenTypeIds.length ||
            instructedTokenAddresses.length != instructedTokenAmounts.length ||
            instructedTokenAddresses.length != tokenTypeIds.length ||
            tokenTypeIds.length == 0 ||
            tokenTypeIds.length > 50
        ) {
            revert DependentTokenInvalidArray();
        }
        uint256[] memory tokenTypeIds_ = new uint256[](tokenTypeIds.length);
        for (uint256 i = 0; i < tokenTypeIds.length; ) {
            if (_intTokenTypeId[tokenTypeIds[i]] != 0) {
                revert DependentTokenDuplicatedTokenTypeId();
            }
            tokenTypeIds_[i] = _generateIntTokenTypeId(tokenTypeIds[i]);
            _setInstructions(
                tokenTypeIds_[i],
                instructedTokenAddresses[i],
                instructedTokenTypeIds[i],
                instructedTokenAmounts[i]
            );
            unchecked {
                i++;
            }
        }
        emit TokenTypesInstructionsSet(
            msg.sender,
            tokenTypeIds,
            instructedTokenAddresses,
            instructedTokenTypeIds,
            instructedTokenAmounts
        );
    }

    /// @inheritdoc IDependentTokenUpgradeable
    function mint(
        address to,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) external onlyOwner {
        uint256 tokenId_ = _getDependentTokenId(tokenTypeId, tokenId);
        _mint(to, tokenId_, tokenAmount, '');
    }

    /// @inheritdoc IDependentTokenUpgradeable
    function mintBatch(
        address to,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external onlyOwner {
        if (
            tokenTypeIds.length != tokenIds.length ||
            tokenTypeIds.length != tokenAmounts.length ||
            tokenTypeIds.length == 0
        ) {
            revert DependentTokenInvalidArray();
        }
        uint256[] memory tokenIds_ = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenIds_[i] = _getDependentTokenId(tokenTypeIds[i], tokenIds[i]);
        }
        _mintBatch(to, tokenIds_, tokenAmounts, '');
    }

    /// @inheritdoc IDependentTokenUpgradeable
    function getInstructions(bytes32 tokenId)
        external
        view
        returns (
            address[] memory tokenAddresses,
            bytes32[] memory tokenTypeIds,
            uint256[] memory tokenAmounts
        )
    {
        uint256 intTokenTypeId_ = _intTokenTypeId[tokenId];
        return (
            _tokenInstructions[intTokenTypeId_].instructedTokenAddresses,
            _tokenInstructions[intTokenTypeId_].instructedTokenTypeIds,
            _tokenInstructions[intTokenTypeId_].instructedTokenAmounts
        );
    }

    function _getDependentTokenId(bytes32 tokenTypeId, bytes32 tokenId) private returns (uint256) {
        if (_intTokenTypeId[tokenTypeId] == 0) {
            revert DependentTokenNonExistentTokenTypeId();
        }
        return _getTokenId(_intTokenTypeId[tokenTypeId], tokenTypeId, tokenId);
    }

    function _setInstructions(
        uint256 tokenTypeId,
        address[] calldata instructedTokenAddresses,
        bytes32[] calldata instructedTokenTypeIds,
        uint256[] calldata instructedTokenAmounts
    ) private {
        if (
            instructedTokenAddresses.length != instructedTokenTypeIds.length ||
            instructedTokenAddresses.length != instructedTokenAmounts.length ||
            instructedTokenAddresses.length == 0 ||
            instructedTokenAddresses.length > 50
        ) {
            revert DependentTokenInvalidArray();
        }
        for (uint256 i = 0; i < instructedTokenAddresses.length; ) {
            if (instructedTokenAddresses[i] == address(0)) {
                revert DependentTokenInvalidAddress();
            }
            if (instructedTokenAmounts[i] == 0) {
                revert DependentTokenInvalidAmount();
            }
            bytes32 key = keccak256(abi.encodePacked(instructedTokenAddresses[i], instructedTokenTypeIds[i]));
            if (_isTypeInstructed[tokenTypeId][key]) {
                revert DependentTokenInvalidAddress();
            }
            _isTypeInstructed[tokenTypeId][key] = true;
            unchecked {
                i++;
            }
        }
        _tokenInstructions[tokenTypeId].instructedTokenAddresses = instructedTokenAddresses;
        _tokenInstructions[tokenTypeId].instructedTokenTypeIds = instructedTokenTypeIds;
        _tokenInstructions[tokenTypeId].instructedTokenAmounts = instructedTokenAmounts;
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[48] private __gap;
}
