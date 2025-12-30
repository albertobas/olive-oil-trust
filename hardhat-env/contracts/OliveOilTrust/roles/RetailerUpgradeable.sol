// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/BaseSeller.sol';
import '../interfaces/IBaseToken.sol';
import '../interfaces/ICommercialUnitsEscrowUpgradeable.sol';
import '../interfaces/IIndustrialUnitsEscrowUpgradeable.sol';
import '../interfaces/IIndustrialUnitTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';

/**
 * @title BottleManufacturerUpgradeable contract in a supply chain.
 * @notice Implementation of an upgradeable contract that represents the tasks of a retailer in the olive
 *     oil supply chain.
 */
contract RetailerUpgradeable is
    Initializable,
    UUPSUpgradeable,
    BaseSeller,
    OwnableUpgradeable,
    ERC1155HolderUpgradeable
{
    /**
     * @dev Initialize function.
     * @param memberName The name of the member.
     * @param escrow_ The commercial units escrow address.
     */
    function __RetailerUpgradeable_init(string memory memberName, address escrow_) internal onlyInitializing {
        __UUPSUpgradeable_init_unchained();
        __BaseMember_init_unchained(memberName);
        __BaseSeller_init_unchained(escrow_);
        __Ownable_init_unchained();
        __ERC1155Holder_init_unchained();
        __RetailerUpgradeable_init_unchained();
    }

    function __RetailerUpgradeable_init_unchained() internal onlyInitializing {}

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /**
     * @dev Checks that _escrow is approved to operate token `tokenAddress` ownedby this contract and approve it if
     *     it is not. Then, it initializes a new escrow contract and deposits a token.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The amount of token.
     * @param tokenPrice The price of the token.
     * @param sellerWallet The address of the seller's wallet
     */
    function depositToken(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        uint256 tokenPrice,
        address payable sellerWallet
    ) external onlyOwner {
        if (!IBaseToken(tokenAddress).isApprovedForAll(address(this), address(_escrow))) {
            IBaseToken(tokenAddress).setApprovalForAll(address(_escrow), true);
        }
        ICommercialUnitsEscrowUpgradeable(_escrow).depositToken(
            tokenAddress,
            tokenTypeId,
            tokenId,
            tokenAmount,
            tokenPrice,
            sellerWallet
        );
    }

    /**
     * @dev Checks that _escrow is approved to operate token `tokenAddress` ownedby this contract and approve it if
     *     it is not. Then, it initializes a new escrow contract and deposits multiple tokens.
     * @param tokenAddress The address of the token.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The amounts of tokens.
     * @param batchPrice The price of the tokens.
     * @param sellerWallet The address of the seller's wallet
     */
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        uint256 batchPrice,
        address payable sellerWallet
    ) external onlyOwner {
        if (!IBaseToken(tokenAddress).isApprovedForAll(address(this), address(_escrow))) {
            IBaseToken(tokenAddress).setApprovalForAll(address(_escrow), true);
        }
        ICommercialUnitsEscrowUpgradeable(_escrow).depositBatch(
            tokenAddress,
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

    /**
     * @dev See {IIndustrialUnitsEscrowUpgradeable-makePayment}
     * @param escrowAddress_ The address of the escrow.
     * @param escrowId The id of the escrow.
     * @param wallet The address funds will be sent to if a refund occurs.
     */
    function makePayment(
        address escrowAddress_,
        uint256 escrowId,
        address payable wallet
    ) public payable onlyOwner {
        IIndustrialUnitsEscrowUpgradeable(escrowAddress_).makePayment{ value: msg.value }(escrowId, wallet);
    }

    /**
     * @dev See {IIndustrialUnitsEscrowUpgradeable-cancelPayment}
     * @param escrowAddress_ The address of the escrow.
     * @param escrowId The id of the escrow.
     */
    function cancelPayment(address escrowAddress_, uint256 escrowId) public onlyOwner {
        IIndustrialUnitsEscrowUpgradeable(escrowAddress_).cancelPayment(escrowId);
    }

    /**
     * @notice See {IIndustrialUnitTokenUpgradeable-unpack}
     * @param tokenAddress The address of the token.
     * @param tokenId The id of the token.
     */
    function unpack(address tokenAddress, bytes32 tokenId) external {
        IIndustrialUnitTokenUpgradeable(tokenAddress).unpack(address(this), tokenId);
    }

    /**
     * @notice See {IIndustrialUnitTokenUpgradeable-unpackBatch}
     * @param tokenAddress The address of the token.
     * @param tokenIds The ids of the tokens.
     */
    function unpackBatch(address tokenAddress, bytes32[] calldata tokenIds) external {
        IIndustrialUnitTokenUpgradeable(tokenAddress).unpackBatch(address(this), tokenIds);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;
}
