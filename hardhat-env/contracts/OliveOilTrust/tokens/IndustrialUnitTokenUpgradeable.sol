// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../interfaces/IBaseToken.sol";
import "../interfaces/IIndustrialUnitTokenUpgradeable.sol";
import "../libraries/Constants.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

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
    ERC1155HolderUpgradeable,
    OwnableUpgradeable,
    IIndustrialUnitTokenUpgradeable
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
        __ERC1155_init_unchained(uri_);
        __Ownable_init_unchained();
        __IndustrialUnitTokenUpgradeable_init_unchained();
    }

    function __IndustrialUnitTokenUpgradeable_init_unchained() internal onlyInitializing {}

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function pack(
        address owner_,
        bytes32 palletId,
        address[] memory tokenAddresses,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external onlyOwner {
        emit SinglePacked(owner_, palletId, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
        uint256 palletId_ = _pack(palletId, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
        _mint(owner_, palletId_, 1, "");
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
        uint256 len = tokenAddresses.length;
        if (
            len != palletIds.length ||
            len != tokenTypeIds.length ||
            len != tokenIds.length ||
            len != tokenAmounts.length ||
            len == 0 ||
            len > Constants.MAX_BATCH_SIZE
        ) {
            revert IndustrialUnitTokenInvalidArray();
        }
        uint256[] memory palletIds_ = new uint256[](len);
        uint256[] memory packAmounts = new uint256[](len);
        emit BatchPacked(owner_, palletIds, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts);
        for (uint256 i = 0; i < len; ) {
            uint256 palletId = _pack(palletIds[i], tokenAddresses[i], tokenTypeIds[i], tokenIds[i], tokenAmounts[i]);
            palletIds_[i] = palletId;
            packAmounts[i] = 1;
            unchecked {
                i++;
            }
        }
        _mintBatch(owner_, palletIds_, packAmounts, "");
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function unpack(address owner_, bytes32 palletId) external {
        if (owner_ != msg.sender) {
            revert IndustrialUnitTokenInvalidCaller();
        }
        uint256 palletId_ = _unpack(owner_, palletId);
        emit SingleUnpacked(owner_, palletId);
        _burn(owner_, palletId_, 1);
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function unpackBatch(address owner_, bytes32[] calldata palletIds) external {
        if (owner_ != msg.sender) {
            revert IndustrialUnitTokenInvalidCaller();
        }
        uint256 len = palletIds.length;
        if (len == 0 || len > Constants.MAX_BATCH_SIZE) {
            revert IndustrialUnitTokenInvalidArray();
        }
        uint256[] memory palletIds_ = new uint256[](len);
        uint256[] memory packAmounts = new uint256[](len);
        for (uint256 i = 0; i < len; ) {
            palletIds_[i] = _unpack(owner_, palletIds[i]);
            packAmounts[i] = 1;
            unchecked {
                i++;
            }
        }
        emit BatchUnpacked(owner_, palletIds);
        _burnBatch(owner_, palletIds_, packAmounts);
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function bytesToIntId(bytes32 palletId) external view returns (uint256) {
        return _intId[palletId];
    }

    /// @inheritdoc IIndustrialUnitTokenUpgradeable
    function getTokens(
        bytes32 palletId
    ) public view returns (address[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory) {
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
        uint256 len = tokenAddresses.length;
        if (
            len != tokenTypeIds.length ||
            len != tokenIds.length ||
            len != tokenAmounts.length ||
            len == 0 ||
            len > Constants.MAX_BATCH_SIZE
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
        _industrialUnitToken[palletId_].addresses = tokenAddresses;
        _industrialUnitToken[palletId_].tokenTypeIds = tokenTypeIds;
        _industrialUnitToken[palletId_].tokenIds = tokenIds;
        _industrialUnitToken[palletId_].amounts = tokenAmounts;
        for (uint256 i = 0; i < len; ) {
            // slither-disable-next-line calls-loop
            uint256 intTokenId = IBaseToken(tokenAddresses[i]).bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
            // slither-disable-next-line calls-loop
            if (IBaseToken(tokenAddresses[i]).balanceOf(msg.sender, intTokenId) < tokenAmounts[i]) {
                {
                    revert IndustrialUnitTokenInvalidBalance();
                }
            }
            // slither-disable-next-line calls-loop
            IBaseToken(tokenAddresses[i]).safeTransferFrom(msg.sender, address(this), intTokenId, tokenAmounts[i], "");
            unchecked {
                i++;
            }
        }
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
        // slither-disable-next-line costly-loop
        delete _industrialUnitToken[intPackId];

        for (uint256 i = 0; i < addresses.length; ) {
            // slither-disable-next-line calls-loop
            uint256 intTokenId = IBaseToken(addresses[i]).bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
            // slither-disable-next-line calls-loop
            IBaseToken(addresses[i]).safeTransferFrom(address(this), owner_, intTokenId, amounts[i], "");
            unchecked {
                i++;
            }
        }
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
        uint256 len = ids.length;
        bytes32[] memory ids_ = new bytes32[](len);
        for (uint256 i = 0; i < len; i++) {
            uint256 id = ids[i];
            ids_[i] = _bytesId[id];
        }
        if (len > 1) {
            emit BatchTransferred(operator, from, to, ids_, amounts);
        } else {
            emit TokenTransferred(operator, from, to, ids_[0], amounts[0]);
        }
    }

    /// @dev See {IERC165Upgradeable-supportsInterface}.
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155ReceiverUpgradeable, ERC1155Upgradeable, IERC165Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[46] private __gap;
}
