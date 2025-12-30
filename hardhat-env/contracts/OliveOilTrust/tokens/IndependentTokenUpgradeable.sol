// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../base/BaseToken.sol";
import "../interfaces/IIndependentTokenUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title IndependentTokenUpgradeable contract.
 * @dev Implementation of a contract that aims to represent an independent token in the supply chain, i.e.
 *     a token that does not require other token/s to be minted.
 *     Inherits from BaseToken, see {BaseToken}.
 *     It requires a base URI.
 */
contract IndependentTokenUpgradeable is Initializable, BaseToken, OwnableUpgradeable, IIndependentTokenUpgradeable {
    /// @dev Mapping from token type id to token id
    mapping(uint256 => uint256[]) private _tokenId;

    function __IndependentTokenUpgradeable_init(string memory uri_) internal onlyInitializing {
        __ERC1155_init_unchained(uri_);
        __Ownable_init_unchained();
        __BaseToken_init_unchained();
        __IndependentTokenUpgradeable_init_unchained();
    }

    function __IndependentTokenUpgradeable_init_unchained() internal onlyInitializing {}

    /// @inheritdoc IIndependentTokenUpgradeable
    function mint(address to, bytes32 tokenTypeId, bytes32 tokenId, uint256 tokenAmount) external onlyOwner {
        uint256 tokenTypeId_ = _getIntTokenTypeId(tokenTypeId);
        uint256 tokenId_ = _getTokenId(tokenTypeId_, tokenTypeId, tokenId);
        _tokenId[tokenTypeId_].push(tokenId_);
        _mint(to, tokenId_, tokenAmount, "");
    }

    /// @inheritdoc IIndependentTokenUpgradeable
    function mintBatch(
        address to,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] memory tokenAmounts
    ) external onlyOwner {
        if (
            tokenTypeIds.length != tokenIds.length ||
            tokenTypeIds.length != tokenAmounts.length ||
            tokenTypeIds.length == 0 ||
            tokenTypeIds.length > 50
        ) {
            revert IndependentTokenInvalidArray();
        }
        uint256[] memory tokenIds_ = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; ) {
            uint256 tokenTypeId_ = _getIntTokenTypeId(tokenTypeIds[i]);
            uint256 tokenId = _getTokenId(tokenTypeId_, tokenTypeIds[i], tokenIds[i]);
            tokenIds_[i] = tokenId;
            _tokenId[tokenTypeId_].push(tokenId);
            unchecked {
                i++;
            }
        }
        _mintBatch(to, tokenIds_, tokenAmounts, "");
    }

    function _getIntTokenTypeId(bytes32 tokenTypeId) private returns (uint256) {
        uint256 tokenTypeId_ = _intTokenTypeId[tokenTypeId];
        if (tokenTypeId_ != 0) {
            return tokenTypeId_;
        }
        return _generateIntTokenTypeId(tokenTypeId);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[49] private __gap;
}
