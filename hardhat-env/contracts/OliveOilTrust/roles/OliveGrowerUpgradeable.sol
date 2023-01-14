// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/BaseSeller.sol';
import '../interfaces/IAgriculturalEscrowUpgradeable.sol';
import '../interfaces/IIndependentTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';

/**
 * @title OliveGrowerUpgradeable contract in a supply chain.
 * @notice Implementation of an upgradeable contract that represents the tasks of an olive grower in an olive
 *     oil supply chain.
 */
contract OliveGrowerUpgradeable is
    Initializable,
    UUPSUpgradeable,
    BaseSeller,
    OwnableUpgradeable,
    ERC1155HolderUpgradeable
{
    /// @dev IIndependentTokenUpgradeable reference used to interact with the independent token contract
    address private _token;

    /// @dev IAgriculturalEscrowUpgradeable reference used to interact with the escrow
    address private _escrow;

    /**
     * @dev Initialize function.
     * @param memberName The name of the member.
     * @param token_ The independent token address.
     * @param escrow_ The agricultural escrow address.
     */
    function __OliveGrowerUpgradeable_init(
        string memory memberName,
        address token_,
        address escrow_
    ) internal onlyInitializing {
        __OliveGrowerUpgradeable_init_unchained(token_, escrow_);
        __UUPSUpgradeable_init();
        __BaseSeller_init(memberName, escrow_);
        __ERC1155Holder_init();
        __Ownable_init();
        IIndependentTokenUpgradeable(token_).setApprovalForAll(address(escrow_), true);
    }

    function __OliveGrowerUpgradeable_init_unchained(address token_, address escrow_) internal onlyInitializing {
        _token = token_;
        _escrow = escrow_;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @dev See {IIndependentTokenUpgradeable-mint}
    function mint(
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) public onlyOwner {
        IIndependentTokenUpgradeable(_token).mint(address(this), tokenTypeId, tokenId, tokenAmount);
    }

    /// @dev See {IIndependentTokenUpgradeable-mintBatch}
    function mintBatch(
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) public onlyOwner {
        IIndependentTokenUpgradeable(_token).mintBatch(address(this), tokenTypeIds, tokenIds, tokenAmounts);
    }

    /// @inheritdoc BaseSeller
    function burn(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) public override onlyOwner {
        super.burn(tokenAddress, tokenTypeId, tokenId, tokenAmount);
    }

    /// @inheritdoc BaseSeller
    function burnBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) public override onlyOwner {
        super.burnBatch(tokenAddress, tokenTypeIds, tokenIds, tokenAmounts);
    }

    /// @dev See {IAgriculturalEscrowUpgradeable-depositToken}
    function depositToken(
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        address payable sellerWallet
    ) public onlyOwner {
        IAgriculturalEscrowUpgradeable(_escrow).depositToken(
            address(_token),
            tokenTypeId,
            tokenId,
            tokenAmount,
            sellerWallet
        );
    }

    /// @dev See {IAgriculturalEscrowUpgradeable-depositBatch}
    function depositBatch(
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        address payable sellerWallet
    ) public onlyOwner {
        IAgriculturalEscrowUpgradeable(_escrow).depositBatch(
            address(_token),
            tokenTypeIds,
            tokenIds,
            tokenAmounts,
            sellerWallet
        );
    }

    /// @inheritdoc BaseSeller
    function revertBeforePayment(uint256 escrowId) public override onlyOwner {
        super.revertBeforePayment(escrowId);
    }

    /// @inheritdoc BaseSeller
    function revertAfterPayment(uint256 escrowId) public override onlyOwner {
        super.revertAfterPayment(escrowId);
    }

    /// @inheritdoc BaseSeller
    function closeEscrow(uint256 escrowId) public override onlyOwner {
        super.closeEscrow(escrowId);
    }
}
