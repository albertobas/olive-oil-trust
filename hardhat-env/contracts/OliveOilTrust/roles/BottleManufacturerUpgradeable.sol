// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/BaseSeller.sol';
import '../interfaces/IIndependentTokenUpgradeable.sol';
import '../interfaces/ICommercialUnitsEscrowUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';

/**
 * @title BottleManufacturerUpgradeable contract.
 * @notice Implementation of an upgradeable contract that represents the tasks of a bottle manufacturer in the olive
 *     oil supply chain.
 */
contract BottleManufacturerUpgradeable is
    Initializable,
    UUPSUpgradeable,
    BaseSeller,
    ERC1155HolderUpgradeable,
    OwnableUpgradeable
{
    /// @dev ICommercialUnitsEscrowUpgradeable reference used to interact with indepenndent token
    address private _token;

    /// @dev ICommercialUnitsEscrowUpgradeable reference used to interact with the escrow contract
    address private _escrow;

    /**
     * @dev Initialize function.
     * @param memberName The name of the member.
     * @param token_ The independent token address.
     * @param escrow_ The commercial units escrow address.
     */
    function __BottleManufacturerUpgradeable_init(
        string memory memberName,
        address token_,
        address escrow_
    ) internal onlyInitializing {
        __BottleManufacturerUpgradeable_init_unchained(token_, escrow_);
        __UUPSUpgradeable_init();
        __BaseSeller_init(memberName, escrow_);
        __Ownable_init();
        __ERC1155Holder_init();
        IIndependentTokenUpgradeable(token_).setApprovalForAll(address(escrow_), true);
    }

    function __BottleManufacturerUpgradeable_init_unchained(address token_, address escrow_) internal onlyInitializing {
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

    /// @dev See {ICommercialUnitsEscrowUpgradeable-depositToken}
    function depositToken(
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        uint256 tokenPrice,
        address payable sellerWallet
    ) public onlyOwner {
        ICommercialUnitsEscrowUpgradeable(_escrow).depositToken(
            address(_token),
            tokenTypeId,
            tokenId,
            tokenAmount,
            tokenPrice,
            sellerWallet
        );
    }

    /// @dev See {ICommercialUnitsEscrowUpgradeable-depositBatch}
    function depositBatch(
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        uint256 batchPrice,
        address payable sellerWallet
    ) public onlyOwner {
        ICommercialUnitsEscrowUpgradeable(_escrow).depositBatch(
            address(_token),
            tokenTypeIds,
            tokenIds,
            tokenAmounts,
            batchPrice,
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
