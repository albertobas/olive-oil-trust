// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../interfaces/IBaseToken.sol';
import '../interfaces/IIndustrialUnitTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

/**
 * @title IndustrialUnitTokenUpgradeable contract.
 * @dev Implementation of a contract that aims to represent an industrial unit token in the supply chain, i.e.
 *     a token that wraps other tokens.
 *     Inherits from IIndustrialUnitTokenUpgradeable, see {IIndustrialUnitTokenUpgradeable}.
 *     It requires a base URI.
 */
contract IndustrialUnitTokenUpgradeable is
    Initializable,
    ERC1155Upgradeable,
    IIndustrialUnitTokenUpgradeable,
    ERC1155HolderUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    /// @dev Struct that gathers information about a single industrial unit
    struct MyIndustrialUnitToken {
        address[] addresses;
        bytes32[] tokenTypeIds;
        bytes32[] tokenIds;
        uint256[] amounts;
    }

    /// @dev A counter to provide token ids
    CountersUpgradeable.Counter private _idsCounter;

    /// @dev Mapping from bytes token id to int token id
    mapping(bytes32 => uint256) private _intId;

    /// @dev Mapping from int token id to bytes token id
    mapping(uint256 => bytes32) private _bytesId;

    /// @dev Mapping from pallet id to IIndustrialUnitTokenUpgradeable.MyIndustrialUnitToken
    mapping(uint256 => MyIndustrialUnitToken) private _industrialUnitToken;

    function __IndustrialUnitTokenUpgradeable_init(string memory uri_) internal onlyInitializing {
        __ERC1155_init(uri_);
        __Ownable_init();
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function pack(
        address owner_,
        bytes32 palletId,
        address[] memory tokenAddresses,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external onlyOwner {
        uint256 palletId_ = _pack(palletId, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
        _mint(owner_, palletId_, 1, '');
        emit SinglePacked(owner_, palletId, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function packBatch(
        address owner_,
        bytes32[] calldata palletIds,
        address[][] memory tokenAddresses,
        bytes32[][] calldata tokenTypeIds,
        bytes32[][] calldata tokenIds,
        uint256[][] calldata tokenAmounts
    ) external onlyOwner {
        if (
            tokenAddresses.length != tokenIds.length ||
            tokenAddresses.length != tokenAmounts.length ||
            tokenAddresses.length == 0
        ) {
            revert IndustrialUnitTokenInvalidArray();
        }
        uint256[] memory palletIds_ = new uint256[](palletIds.length);
        uint256[] memory packAmounts = new uint256[](palletIds.length);
        for (uint256 i = 0; i < palletIds.length; i++) {
            uint256 palletId = _pack(palletIds[i], tokenAddresses[i], tokenTypeIds[i], tokenIds[i], tokenAmounts[i]);
            palletIds_[i] = palletId;
            packAmounts[i] = 1;
        }
        _mintBatch(owner_, palletIds_, packAmounts, '');
        emit BatchPacked(owner_, palletIds, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function unpack(address owner_, bytes32 palletId) external {
        if (owner_ != msg.sender) {
            revert IndustrialUnitTokenInvalidCaller();
        }
        uint256 palletId_ = _unpack(owner_, palletId);
        _burn(owner_, palletId_, 1);
        emit SingleUnpacked(owner_, palletId);
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function unpackBatch(address owner_, bytes32[] calldata palletIds) external {
        if (owner_ != msg.sender) {
            revert IndustrialUnitTokenInvalidCaller();
        }
        uint256[] memory palletIds_ = new uint256[](palletIds.length);
        uint256[] memory packAmounts = new uint256[](palletIds.length);
        for (uint256 i = 0; i < palletIds.length; i++) {
            palletIds_[i] = _unpack(owner_, palletIds[i]);
            packAmounts[i] = 1;
        }
        _burnBatch(owner_, palletIds_, packAmounts);
        emit BatchUnpacked(owner_, palletIds);
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function bytesToIntId(bytes32 palletId) external view returns (uint256) {
        return _intId[palletId];
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function getTokens(bytes32 palletId)
        public
        view
        returns (
            address[] memory,
            bytes32[] memory,
            bytes32[] memory,
            uint256[] memory
        )
    {
        uint256 palletId_ = _intId[palletId];
        return (
            _industrialUnitToken[palletId_].addresses,
            _industrialUnitToken[palletId_].tokenTypeIds,
            _industrialUnitToken[palletId_].tokenIds,
            _industrialUnitToken[palletId_].amounts
        );
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function intToBytesId(uint256 palletId) external view returns (bytes32) {
        return _bytesId[palletId];
    }

    function _pack(
        bytes32 palletId,
        address[] memory tokenAddresses,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) private returns (uint256) {
        if (
            tokenAddresses.length != tokenIds.length ||
            tokenAddresses.length != tokenAmounts.length ||
            tokenAddresses.length == 0
        ) {
            revert IndustrialUnitTokenInvalidArray();
        }
        if (_intId[palletId] != 0) {
            revert IndustrialUnitTokenDuplicatedId();
        }
        if (_idsCounter.current() == 0) _idsCounter.increment();
        uint256 palletId_ = _idsCounter.current();
        _idsCounter.increment();
        _intId[palletId] = palletId_;
        _bytesId[palletId_] = palletId;
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            uint256 intTokenId = IBaseToken(tokenAddresses[i]).bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
            if (IBaseToken(tokenAddresses[i]).balanceOf(msg.sender, intTokenId) < tokenAmounts[i]) {
                {
                    revert IndustrialUnitTokenInvalidBalance();
                }
            }
            IBaseToken(tokenAddresses[i]).safeTransferFrom(msg.sender, address(this), intTokenId, tokenAmounts[i], '');
        }
        _industrialUnitToken[palletId_].addresses = tokenAddresses;
        _industrialUnitToken[palletId_].tokenTypeIds = tokenTypeIds;
        _industrialUnitToken[palletId_].tokenIds = tokenIds;
        _industrialUnitToken[palletId_].amounts = tokenAmounts;
        return palletId_;
    }

    function _unpack(address owner_, bytes32 palletId) private returns (uint256) {
        uint256 intPackId = _intId[palletId];
        if (balanceOf(owner_, intPackId) == 0) {
            revert IndustrialUnitTokenInvalidBalance();
        }
        (
            address[] memory addresses,
            bytes32[] memory tokenTypeIds,
            bytes32[] memory tokenIds,
            uint256[] memory amounts
        ) = getTokens(palletId);
        for (uint256 i = 0; i < addresses.length; i++) {
            uint256 intTokenId = IBaseToken(addresses[i]).bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
            IBaseToken(addresses[i]).safeTransferFrom(address(this), owner_, intTokenId, amounts[i], '');
        }
        delete _industrialUnitToken[intPackId];
        return intPackId;
    }

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory
    ) internal override {
        bytes32[] memory ids_ = new bytes32[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            ids_[i] = _bytesId[id];
        }
        if (ids.length > 1) {
            emit BatchTransferred(operator, from, to, ids_, amounts);
        } else {
            emit TokenTransferred(operator, from, to, ids_[0], amounts[0]);
        }
    }

    /// @dev See {IERC165Upgradeable-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155ReceiverUpgradeable, ERC1155Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
