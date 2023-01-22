// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/BaseSeller.sol';
import '../interfaces/IDependentTokenUpgradeable.sol';
import '../interfaces/IIndustrialUnitTokenUpgradeable.sol';
import '../interfaces/IBaseToken.sol';
import '../interfaces/IIndustrialUnitsEscrowUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';

/**
 * @title DistributorUpgradeable contract in a supply chain.
 * @notice Implementation of an upgradeable contract that represents the tasks of a distributor in the olive
 *     oil supply chain.
 */
contract DistributorUpgradeable is
    Initializable,
    UUPSUpgradeable,
    BaseSeller,
    OwnableUpgradeable,
    ERC1155HolderUpgradeable
{
    /// @dev IIndustrialUnitTokenUpgradeable reference used to interact with the token contract
    address internal _industrialUnitToken;

    /// @dev IIndustrialUnitsEscrowUpgradeable reference used to interact with the escrow contract
    address private _escrow;

    /**
     * @dev Initialize function.
     * @param memberName The name of the member.
     * @param industrialUnitToken_ The industrial unit address.
     * @param escrow_ The industrial units escrow address.
     */
    function __DistributorUpgradeable_init(
        string memory memberName,
        address industrialUnitToken_,
        address escrow_
    ) internal onlyInitializing {
        __DistributorUpgradeable_init_unchained(industrialUnitToken_, escrow_);
        __UUPSUpgradeable_init();
        __BaseSeller_init(memberName, escrow_);
        __ERC1155Holder_init();
        __Ownable_init();
    }

    function __DistributorUpgradeable_init_unchained(address industrialUnitToken_, address escrow_)
        internal
        onlyInitializing
    {
        _escrow = escrow_;
        _industrialUnitToken = industrialUnitToken_;
        IIndustrialUnitTokenUpgradeable(industrialUnitToken_).setApprovalForAll(address(escrow_), true);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @dev See {IIndustrialUnitsEscrowUpgradeable-depositToken}
    function depositToken(
        bytes32 tokenId,
        uint256 tokenPrice,
        address payable sellerWallet
    ) public onlyOwner {
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
     * @dev Checks that _industrialUnitToken is approved to operate every token in `tokenAddresses` owned
     *     by this contract and approve it if it is not. Then calls pack, see {IIndustrialUnitTokenUpgradeable-pack}.
     * @param id The id of the token.
     * @param tokenAddresses The addresses of the tokens that will be packed.
     * @param tokenTypeIds The ids of the types of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    function pack(
        bytes32 id,
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external onlyOwner {
        _setApprovals(tokenAddresses);
        IIndustrialUnitTokenUpgradeable(_industrialUnitToken).pack(
            address(this),
            id,
            tokenAddresses,
            tokenTypeIds,
            tokenIds,
            tokenAmounts
        );
    }

    /**
     * @dev Checks that _industrialUnitToken is approved to operate every token in `tokenAddresses` owned
     *     by this contract and approve it if it is not. Then calls packBatch, see
     *     {IIndustrialUnitTokenUpgradeable-packBatch}.
     * @param ids The ids of the tokens.
     * @param tokenAddresses The addresses of the tokens that will be packed.
     * @param tokenTypeIds The ids of the types of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    function packBatch(
        bytes32[] calldata ids,
        address[][] calldata tokenAddresses,
        bytes32[][] calldata tokenTypeIds,
        bytes32[][] calldata tokenIds,
        uint256[][] calldata tokenAmounts
    ) external onlyOwner {
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            _setApprovals(tokenAddresses[i]);
        }
        IIndustrialUnitTokenUpgradeable(_industrialUnitToken).packBatch(
            address(this),
            ids,
            tokenAddresses,
            tokenTypeIds,
            tokenIds,
            tokenAmounts
        );
    }

    /// @dev See {IIndustrialUnitTokenUpgradeable-unpack}
    function unpack(address tokenAddress, bytes32 tokenId) external {
        IIndustrialUnitTokenUpgradeable(tokenAddress).unpack(address(this), tokenId);
    }

    /// @dev See {IIndustrialUnitTokenUpgradeable-unpackBatch}
    function unpackBatch(address tokenAddress, bytes32[] calldata tokenIds) external {
        IIndustrialUnitTokenUpgradeable(tokenAddress).unpackBatch(address(this), tokenIds);
    }

    function _setApprovals(address[] calldata tokenAddresses) private {
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            if (
                !IDependentTokenUpgradeable(tokenAddresses[i]).isApprovedForAll(
                    address(this),
                    address(_industrialUnitToken)
                )
            ) {
                IDependentTokenUpgradeable(tokenAddresses[i]).setApprovalForAll(address(_industrialUnitToken), true);
            }
        }
    }
}
