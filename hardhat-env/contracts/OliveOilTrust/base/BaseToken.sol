// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../interfaces/IBaseToken.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol';

/**
 * @title BaseToken contract.
 * @dev Contract that implements logic common to both IndependentTokenUpgradeable and DependentTokenUpgradeable
 *     in the supply chain. It inherits from ERC1155Upgradeable, as it complies with the ERC1155 token standard.
 *     The rationale behind this is to allow a smart contract to represent multiple tokens at once.
 *     In our case, every token minted will be a fungible token that corresponds to a token of a product entity.
 *     Therefore, products from different tokens won't be interchangeable whereas products of the same token will.
 *     The ERC1155 fungibility-agnostic standard also allows to mint and/or burn multiple tokens at once with
 *     the same call, which in a context of a supply chain is ideal in order to make the use case of every actor
 *     much more efficient. The tokens are expected to get assigned an id for its type and a unique id. EAN
 *     standards (EAN-14 or EAN-13), or similar, are expected to be used.
 */
contract BaseToken is ERC1155Upgradeable, IBaseToken {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @dev A counter to provide token ids
    CountersUpgradeable.Counter internal _tokenIdsCounter;

    /// @dev A counter to provide token type ids
    CountersUpgradeable.Counter internal _tokenTypeIdsCounter;

    /// @dev Mapping from token id to token type id
    mapping(uint256 => uint256) private _tokenTypeId;

    /// @dev Mapping from bytes token type id to int token type id
    mapping(bytes32 => uint256) internal _intTokenTypeId;

    /// @dev Mapping from int token type id to bytes token type id
    mapping(uint256 => bytes32) private _bytesTokenTypeId;

    /// @dev Mapping from bytes token id to int token id
    mapping(bytes32 => uint256) private _intTokenId;

    /// @dev Mapping from int token id to bytes token id
    mapping(uint256 => bytes32) private _bytesTokenId;

    function __BaseToken_init(string memory uri_) internal onlyInitializing {
        __ERC1155_init_unchained(uri_);
    }

    /// @inheritdoc IBaseToken
    function burn(
        address account,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) external {
        if (account != msg.sender && !isApprovedForAll(account, msg.sender)) {
            revert BaseTokenInvalidCaller();
        }
        bytes32 tokenId_ = keccak256(abi.encodePacked(tokenTypeId, tokenId));
        uint256 intTokenId = _intTokenId[tokenId_];
        _burn(account, intTokenId, tokenAmount);
    }

    /// @inheritdoc IBaseToken
    function burnBatch(
        address account,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external {
        if (account != msg.sender && !isApprovedForAll(account, msg.sender)) {
            revert BaseTokenInvalidCaller();
        }
        uint256[] memory tokenIds_ = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            bytes32 tokenId = keccak256(abi.encodePacked(tokenTypeIds[i], tokenIds[i]));
            uint256 id_ = _intTokenId[tokenId];
            tokenIds_[i] = id_;
        }
        _burnBatch(account, tokenIds_, tokenAmounts);
    }

    /// @inheritdoc IBaseToken
    function bytesToIntTokenTypeId(bytes32 tokenId) external view returns (uint256) {
        return _intTokenTypeId[tokenId];
    }

    /// @inheritdoc IBaseToken
    function intToBytesTokenId(uint256 tokenId) external view returns (bytes32) {
        return _bytesTokenId[tokenId];
    }

    /// @inheritdoc IBaseToken
    function bytesToIntTokenId(bytes32 tokenTypeId, bytes32 tokenId) external view returns (uint256) {
        bytes32 tokenId_ = keccak256(abi.encodePacked(tokenTypeId, tokenId));
        return _intTokenId[tokenId_];
    }

    function _generateIntTokenTypeId(bytes32 tokenTypeId) internal returns (uint256 tokenTypeId_) {
        if (_tokenTypeIdsCounter.current() == 0) {
            _tokenTypeIdsCounter.increment();
        }
        tokenTypeId_ = _tokenTypeIdsCounter.current();
        _tokenTypeIdsCounter.increment();
        _intTokenTypeId[tokenTypeId] = tokenTypeId_;
        _bytesTokenTypeId[tokenTypeId_] = tokenTypeId;
    }

    function _getTokenId(
        uint256 intTokenTypeId,
        bytes32 tokenTypeId,
        bytes32 tokenId
    ) internal returns (uint256 intTokenId_) {
        bytes32 tokenId_ = keccak256(abi.encodePacked(tokenTypeId, tokenId));
        if (_intTokenId[tokenId_] != 0) {
            revert BaseTokenDuplicatedTokenId();
        }
        if (_tokenIdsCounter.current() == 0) {
            _tokenIdsCounter.increment();
        }
        intTokenId_ = _tokenIdsCounter.current();
        _tokenIdsCounter.increment();
        _intTokenId[tokenId_] = intTokenId_;

        _bytesTokenId[intTokenId_] = tokenId;
        _tokenTypeId[intTokenId_] = intTokenTypeId;
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory
    ) internal override {
        bytes32[] memory byteTokenTypeIds = new bytes32[](ids.length);
        bytes32[] memory byteTokenIds = new bytes32[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 tokenId_ = ids[i];
            uint256 tokenTypeId_ = _tokenTypeId[tokenId_];
            byteTokenIds[i] = _bytesTokenId[tokenId_];
            byteTokenTypeIds[i] = _bytesTokenTypeId[tokenTypeId_];
        }
        if (ids.length > 1) {
            emit BatchTransferred(operator, from, to, byteTokenTypeIds, byteTokenIds, amounts);
        } else {
            emit TokenTransferred(operator, from, to, byteTokenTypeIds[0], byteTokenIds[0], amounts[0]);
        }
    }
}
