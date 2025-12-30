// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../base/BaseSeller.sol";
import "../base/DependentCreator.sol";
import "../interfaces/IBaseToken.sol";
import "../interfaces/ICommercialUnitsEscrowUpgradeable.sol";
import "../interfaces/IDependentTokenUpgradeable.sol";
import "../interfaces/IIndustrialUnitsEscrowUpgradeable.sol";
import "../interfaces/IIndustrialUnitTokenUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";

/**
 * @title BottlingPlantUpgradeable contract in a supply chain.
 * @notice Implementation of an upgradeable contract that represents the tasks of a bottling plant in the olive
 *     oil supply chain.
 */
contract BottlingPlantUpgradeable is
    Initializable,
    UUPSUpgradeable,
    DependentCreator,
    BaseSeller,
    ERC1155HolderUpgradeable,
    OwnableUpgradeable
{
    /// @dev IIndustrialUnitTokenUpgradeable reference used to interact with the industrial unit token contract
    address internal _industrialUnitToken;

    /**
     * @dev Initialize function.
     * @param memberName The name of the member.
     * @param dependentToken The dependent token address.
     * @param industrialUnitToken_ The industrial unit address.
     * @param escrow_ The industrial units escrow address.
     */
    function __BottlingPlantUpgradeable_init(
        string memory memberName,
        address dependentToken,
        address industrialUnitToken_,
        address escrow_
    ) internal onlyInitializing {
        __UUPSUpgradeable_init_unchained();
        __DependentCreator_init_unchained(dependentToken);
        __BaseMember_init_unchained(memberName);
        __BaseSeller_init_unchained(escrow_);
        __ERC1155Holder_init_unchained();
        __Ownable_init_unchained();
        __BottlingPlantUpgradeable_init_unchained(dependentToken, industrialUnitToken_, escrow_);
    }

    function __BottlingPlantUpgradeable_init_unchained(
        address dependentToken,
        address industrialUnitToken_,
        address escrow_
    ) internal onlyInitializing {
        _industrialUnitToken = industrialUnitToken_;
        IIndustrialUnitTokenUpgradeable(industrialUnitToken_).setApprovalForAll(escrow_, true);
        IDependentTokenUpgradeable(dependentToken).setApprovalForAll(industrialUnitToken_, true);
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

    /// @dev See {IIndustrialUnitsEscrowUpgradeable-depositToken}
    function depositToken(bytes32 tokenId, uint256 tokenPrice, address payable sellerWallet) public onlyOwner {
        IIndustrialUnitsEscrowUpgradeable(_escrow).depositToken(
            address(_industrialUnitToken),
            tokenId,
            tokenPrice,
            sellerWallet
        );
    }

    /// @dev See {IIndustrialUnitsEscrowUpgradeable-depositBatch}
    function depositBatch(
        bytes32[] calldata tokenIds,
        uint256 batchPrice,
        address payable sellerWallet
    ) public onlyOwner {
        IIndustrialUnitsEscrowUpgradeable(_escrow).depositBatch(
            address(_industrialUnitToken),
            tokenIds,
            batchPrice,
            sellerWallet
        );
    }

    /**
     * @dev See {ICommercialUnitsEscrowUpgradeable-makePayment}
     * @param escrowAddress_ The address of the escrow.
     * @param escrowId The id of the escrow.
     * @param wallet The address funds will be sent to if a refund occurs.
     */
    function makePayment(address escrowAddress_, uint256 escrowId, address payable wallet) public payable onlyOwner {
        ICommercialUnitsEscrowUpgradeable(escrowAddress_).makePayment{value: msg.value}(escrowId, wallet);
    }

    /**
     * @dev See {ICommercialUnitsEscrowUpgradeable-cancelPayment}
     * @param escrowAddress_ The address of the escrow.
     * @param escrowId The id of the escrow.
     */
    function cancelPayment(address escrowAddress_, uint256 escrowId) public onlyOwner {
        ICommercialUnitsEscrowUpgradeable(escrowAddress_).cancelPayment(escrowId);
    }

    /**
     * @dev See {IIndustrialUnitTokenUpgradeable-pack}
     * @param palletId The id of the token.
     * @param tokenTypeIds The ids of the types of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    function pack(
        bytes32 palletId,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external onlyOwner {
        address[] memory tokenAddresses = _getAddressesArray(tokenTypeIds.length);
        IIndustrialUnitTokenUpgradeable(_industrialUnitToken).pack(
            address(this),
            palletId,
            tokenAddresses,
            tokenTypeIds,
            tokenIds,
            tokenAmounts
        );
    }

    /**
     * @dev See {IIndustrialUnitTokenUpgradeable-packBatch}
     * @param palletIds The ids of the tokens.
     * @param tokenTypeIds The ids of the types of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    function packBatch(
        bytes32[] calldata palletIds,
        bytes32[][] calldata tokenTypeIds,
        bytes32[][] calldata tokenIds,
        uint256[][] calldata tokenAmounts
    ) external onlyOwner {
        address[][] memory tokenAddresses = new address[][](tokenTypeIds.length);
        for (uint256 i = 0; i < tokenTypeIds.length; i++) {
            tokenAddresses[i] = _getAddressesArray(tokenTypeIds[i].length);
        }
        IIndustrialUnitTokenUpgradeable(_industrialUnitToken).packBatch(
            address(this),
            palletIds,
            tokenAddresses,
            tokenTypeIds,
            tokenIds,
            tokenAmounts
        );
    }

    /// @dev See {IIndustrialUnitTokenUpgradeable-unpack}
    function unpack(bytes32 palletId) external {
        IIndustrialUnitTokenUpgradeable(_industrialUnitToken).unpack(address(this), palletId);
    }

    /// @dev See {IIndustrialUnitTokenUpgradeable-unpackBatch}
    function unpackBatch(bytes32[] calldata palletIds) external {
        IIndustrialUnitTokenUpgradeable(_industrialUnitToken).unpackBatch(address(this), palletIds);
    }

    function _getAddressesArray(uint256 length) private view returns (address[] memory tokenAddresses) {
        tokenAddresses = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            tokenAddresses[i] = address(_dependentToken);
        }
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[49] private __gap;
}
