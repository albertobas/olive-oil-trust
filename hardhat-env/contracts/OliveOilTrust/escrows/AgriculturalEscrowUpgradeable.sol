// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../base/AmountsEscrow.sol";
import "../interfaces/IAgriculturalEscrowUpgradeable.sol";
import "../interfaces/IBaseToken.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/**
 * @title AgriculturalEscrowUpgradeable contract.
 * @dev Implementation of an escrow contract that aims to transfer a number of units of a token or tokens during
 *     the agricultural phase of the olive oil supply chain, in exchange for an amount of ether and without the
 *     involvementof third parties. The price of the tokens in the escrow is offered by the buyer, which is supposed
 *     to be an olive oil mill, after checking the quality of the olives. The process of buying a token is
 *     represented in up to three of six different stages:
 *     1.  A token/s is/are deposited, which sets the state of the escrow to Active.
 *     1a. The deposit of the token/s is/are reverted before a member deposits ether which sets the state to a
 *         final RevertedBeforePayment, transfers funds back to the buyer and token/s back to the seller.
 *     2.  The required amount of ether to buy the token/s is/are deposited, which sets the state to EtherDeposited.
 *     2a. The deposit of ether is cancelled, which sets the state back to Active and transfers the funds
 *         back to the buyer.
 *     2b. The deposit of the token/s is/are reverted after ether is deposited, which sets the state to a
 *         final RevertedAfterPayment, transfers funds back to the buyer and token/s back to the seller.
 *     3.  The escrow operation is completed and buyer and seller get token/s and ether, respectively. The
 *         state of the escrow is finally set to Closed.
 */
contract AgriculturalEscrowUpgradeable is
    Initializable,
    AmountsEscrow,
    OwnableUpgradeable,
    IAgriculturalEscrowUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @dev A counter to provide escrow ids
    CountersUpgradeable.Counter private _escrowsIds;

    // mapping from escrow id to a boolean that indicates if a token is deposited
    mapping(uint256 => mapping(bytes32 => mapping(bytes32 => bool))) private _isTokenDeposited;

    function __AgriculturalEscrowUpgradeable_init() internal onlyInitializing {
        __ERC1155Holder_init_unchained();
        __Ownable_init_unchained();
    }

    /// @inheritdoc IAgriculturalEscrowUpgradeable
    function depositToken(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        address payable sellerWallet
    ) external onlyOwner {
        if (tokenAddress == address(0) || sellerWallet == address(0)) {
            revert AgriculturalEscrowInvalidAddress();
        }
        uint256 escrowId = _escrowsIds.current();
        uint256 tokenId_ = IBaseToken(tokenAddress).bytesToIntTokenId(tokenTypeId, tokenId);
        _escrows[escrowId].state = State.Active;
        _escrows[escrowId].addr = tokenAddress;
        _escrows[escrowId].seller = msg.sender;
        _escrows[escrowId].sellerWallet = sellerWallet;
        _escrows[escrowId].ids = _asSingletonArray(tokenId_);
        _escrows[escrowId].amounts = _asSingletonArray(tokenAmount);
        _escrowsIds.increment();
        emit TokenDeposited(msg.sender, sellerWallet, escrowId, tokenAddress, tokenTypeId, tokenId, tokenAmount);
        IERC1155Upgradeable(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId_, tokenAmount, "");
    }

    /// @inheritdoc IAgriculturalEscrowUpgradeable
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        address payable sellerWallet
    ) external onlyOwner {
        if (tokenAddress == address(0) || sellerWallet == address(0)) {
            revert AgriculturalEscrowInvalidAddress();
        }
        if (
            tokenIds.length != tokenAmounts.length ||
            tokenIds.length != tokenTypeIds.length ||
            tokenIds.length == 0 ||
            tokenIds.length > 50
        ) {
            revert AgriculturalEscrowInvalidArray();
        }
        uint256 escrowId = _escrowsIds.current();
        uint256[] memory tokenIds_ = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; ) {
            if (_isTokenDeposited[escrowId][tokenTypeIds[i]][tokenIds[i]]) {
                revert AgriculturalEscrowInvalidArray();
            }
            _isTokenDeposited[escrowId][tokenTypeIds[i]][tokenIds[i]] = true;
            // slither-disable-next-line calls-loop
            tokenIds_[i] = IBaseToken(tokenAddress).bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
            unchecked {
                i++;
            }
        }
        _escrows[escrowId].state = State.Active;
        _escrows[escrowId].addr = tokenAddress;
        _escrows[escrowId].seller = msg.sender;
        _escrows[escrowId].sellerWallet = sellerWallet;
        _escrows[escrowId].ids = tokenIds_;
        _escrows[escrowId].amounts = tokenAmounts;
        _escrowsIds.increment();
        emit BatchDeposited(msg.sender, sellerWallet, escrowId, tokenAddress, tokenTypeIds, tokenIds, tokenAmounts);
        IERC1155Upgradeable(tokenAddress).safeBatchTransferFrom(msg.sender, address(this), tokenIds_, tokenAmounts, "");
    }

    /// @inheritdoc IBaseEscrow
    function revertBeforePayment(uint256 escrowId) public override(AmountsEscrow, IBaseEscrow) onlyOwner {
        super.revertBeforePayment(escrowId);
    }

    /// @inheritdoc IAgriculturalEscrowUpgradeable
    function makeOffer(uint256 escrowId, address payable buyerWallet) external payable {
        if (state(escrowId) != State.Active) {
            revert AgriculturalEscrowInvalidState();
        }
        if (buyerWallet == address(0)) {
            revert AgriculturalEscrowInvalidAddress();
        }
        uint256 weiAmount = msg.value;
        if (weiAmount == 0) {
            revert AgriculturalEscrowInvalidPrice();
        }
        _escrows[escrowId].state = State.EtherDeposited;
        _escrows[escrowId].balance = weiAmount;
        _escrows[escrowId].buyer = msg.sender;
        _escrows[escrowId].buyerWallet = buyerWallet;
        _escrows[escrowId].price = weiAmount;
        emit EtherDeposited(msg.sender, buyerWallet, escrowId, weiAmount);
    }

    /// @inheritdoc IBaseEscrow
    function revertAfterPayment(uint256 escrowId) public override(AmountsEscrow, IBaseEscrow) onlyOwner {
        super.revertAfterPayment(escrowId);
    }

    /// @inheritdoc IBaseEscrow
    function close(uint256 escrowId) public override(AmountsEscrow, IBaseEscrow) onlyOwner {
        super.close(escrowId);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[48] private __gap;
}
