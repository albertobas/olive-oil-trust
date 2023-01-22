// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/BaseSeller.sol';
import '../base/DependentCreator.sol';
import '../interfaces/IAgriculturalEscrowUpgradeable.sol';
import '../interfaces/IBaseToken.sol';
import '../interfaces/ICommercialUnitsEscrowUpgradeable.sol';
import '../interfaces/IDependentTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';

/**
 * @title OliveOilMillUpgradeable contract in a supply chain.
 * @notice Implementation of an upgradeable contract that represents the tasks of an olive oil mill in the
 *     olive oil supply chain.
 */
contract OliveOilMillUpgradeable is
    Initializable,
    UUPSUpgradeable,
    DependentCreator,
    BaseSeller,
    OwnableUpgradeable,
    ERC1155HolderUpgradeable
{
    /// @dev ICommercialUnitsEscrowUpgradeable reference used to interact with rhe dependent token contract
    address private _token;

    /// @dev ICommercialUnitsEscrowUpgradeable reference used to interact with the escrow contract
    address private _escrow;

    /**
     * @dev Initialize function.
     * @param memberName The name of the member.
     * @param token_ The dependent token address.
     * @param escrow_ The commercial units escrow address.
     */
    function __OliveOilMillUpgradeable_init(
        string memory memberName,
        address token_,
        address escrow_
    ) internal onlyInitializing {
        __OliveOilMillUpgradeable_init_unchained(token_, escrow_);
        __UUPSUpgradeable_init();
        __DependentCreator_init(token_);
        __BaseSeller_init(memberName, escrow_);
        __ERC1155Holder_init();
        __Ownable_init();
        IDependentTokenUpgradeable(token_).setApprovalForAll(address(escrow_), true);
    }

    function __OliveOilMillUpgradeable_init_unchained(address token_, address escrow_) internal onlyInitializing {
        _token = token_;
        _escrow = escrow_;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @inheritdoc DependentCreator
    function setTokenTypeInstructions(
        bytes32 tokenTypeId,
        address[] calldata instructedTokenAddresses,
        bytes32[] calldata instructedTokenTypeIds,
        uint256[] calldata instructedTokenAmounts
    ) public override onlyOwner {
        super.setTokenTypeInstructions(
            tokenTypeId,
            instructedTokenAddresses,
            instructedTokenTypeIds,
            instructedTokenAmounts
        );
    }

    /// @inheritdoc DependentCreator
    function setTokenTypesInstructions(
        bytes32[] calldata tokenTypeIds,
        address[][] calldata instructedTokenAddresses,
        bytes32[][] calldata instructedTokenTypeIds,
        uint256[][] calldata instructedTokenAmounts
    ) public override onlyOwner {
        super.setTokenTypesInstructions(
            tokenTypeIds,
            instructedTokenAddresses,
            instructedTokenTypeIds,
            instructedTokenAmounts
        );
    }

    /// @inheritdoc DependentCreator
    function mint(
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        Validation.MintDependentData calldata data
    ) public override onlyOwner {
        super.mint(tokenTypeId, tokenId, tokenAmount, data);
    }

    /// @inheritdoc DependentCreator
    function mintBatch(
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        Validation.MintDependentData[] calldata data
    ) public override onlyOwner {
        super.mintBatch(tokenTypeIds, tokenIds, tokenAmounts, data);
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

    /**
     * @dev See {IAgriculturalEscrowUpgradeable-makeOffer}
     * @param escrowAddress_ The address of the escrow.
     * @param escrowId The id of the escrow.
     * @param wallet The address funds will be sent to if a refund occurs.
     */
    function makeOffer(
        address escrowAddress_,
        uint256 escrowId,
        address payable wallet
    ) external payable onlyOwner {
        IAgriculturalEscrowUpgradeable(escrowAddress_).makeOffer{ value: msg.value }(escrowId, wallet);
    }

    /**
     * @dev See {IAgriculturalEscrowUpgradeable-cancelPayment}
     * @param escrowAddress_ The address of the escrow.
     * @param escrowId The id of the escrow.
     */
    function cancelPayment(address escrowAddress_, uint256 escrowId) external onlyOwner {
        IAgriculturalEscrowUpgradeable(escrowAddress_).cancelPayment(escrowId);
    }
}
