// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../base/AmountsEscrow.sol';
import '../interfaces/IBaseToken.sol';
import '../interfaces/ICommercialUnitsEscrowUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title CommercialUnitsEscrowUpgradeable contract.
 * @dev Implementation of an escrow contract that aims to transfer an amount of a token or tokens in exchange
 *     for an amount of ether, without the involvement of third parties. Members that are expected to use this
 *     type of escrow are all the members that sell dependent or independent tokens but olives. This is because
 *     the price of the token or tokens is set when it is, or they are, deposited. The process of buying a token
 *     or the tokens is represented inup to three of six different stages:
 *     1.  A token/s is/are deposited, which sets the state of the escrow to Active.
 *     1a. The deposit of the token/s is/are reverted before a member deposits Ether which sets State
 *         to a final RevertedBeforePayment, transfers funds back to the buyer and token/s back to the seller.
 *     2.  The required amount of ether to buy the token/s is/are deposited, which sets the state to EtherDeposited.
 *     2a. The deposit of ether is cancelled, which sets the state back to Active and transfers the funds
 *         back to the buyer.
 *     2b. The deposit of the token/s is/are reverted after ether is deposited, which sets the state to a
 *         final RevertedAfterPayment, transfers funds back to the buyer and token/s back to the seller.
 *     3.  The escrow operation is completed and buyer and seller get token/s and ether, respectively. The
 *         state of the escrow is finally set to Closed.
 */
contract CommercialUnitsEscrowUpgradeable is
    Initializable,
    AmountsEscrow,
    ICommercialUnitsEscrowUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @dev A counter to provide escrow ids
    CountersUpgradeable.Counter private _escrowsIds;

    // mapping from escrow id to a boolean that indicates if a token is deposited
    mapping(uint256 => mapping(bytes32 => mapping(bytes32 => bool))) private _isTokenDeposited;

    function __CommercialUnitsEscrowUpgradeable_init() internal onlyInitializing {
        __ERC1155Holder_init();
        __Ownable_init();
    }

    /// @inheritdoc ICommercialUnitsEscrowUpgradeable
    function depositToken(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        uint256 tokenPrice,
        address payable sellerWallet
    ) external onlyOwner {
        if (tokenAddress == address(0) || sellerWallet == address(0)) {
            revert CommercialUnitsEscrowInvalidAddress();
        }
        if (tokenPrice == 0) {
            revert CommercialUnitsEscrowInvalidPrice();
        }
        uint256 escrowId = _escrowsIds.current();
        uint256 tokenId_ = IBaseToken(tokenAddress).bytesToIntTokenId(tokenTypeId, tokenId);
        _escrows[escrowId].state = State.Active;
        _escrows[escrowId].addr = tokenAddress;
        _escrows[escrowId].seller = msg.sender;
        _escrows[escrowId].sellerWallet = sellerWallet;
        _escrows[escrowId].ids = _asSingletonArray(tokenId_);
        _escrows[escrowId].amounts = _asSingletonArray(tokenAmount);
        _escrows[escrowId].price = tokenPrice;
        _escrowsIds.increment();
        IERC1155Upgradeable(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId_, tokenAmount, '');
        emit TokenDeposited(
            msg.sender,
            sellerWallet,
            escrowId,
            tokenAddress,
            tokenTypeId,
            tokenId,
            tokenAmount,
            tokenPrice
        );
    }

    /// @inheritdoc ICommercialUnitsEscrowUpgradeable
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        uint256 batchPrice,
        address payable sellerWallet
    ) external onlyOwner {
        if (tokenAddress == address(0) || sellerWallet == address(0)) {
            revert CommercialUnitsEscrowInvalidAddress();
        }
        if (tokenIds.length != tokenAmounts.length) {
            revert CommercialUnitsEscrowInvalidArray();
        }
        if (batchPrice == 0) {
            revert CommercialUnitsEscrowInvalidPrice();
        }
        uint256 escrowId = _escrowsIds.current();
        uint256[] memory tokenIds_ = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_isTokenDeposited[escrowId][tokenTypeIds[i]][tokenIds[i]] == true) {
                revert CommercialUnitsEscrowInvalidArray();
            }
            _isTokenDeposited[escrowId][tokenTypeIds[i]][tokenIds[i]] = true;
            tokenIds_[i] = IBaseToken(tokenAddress).bytesToIntTokenId(tokenTypeIds[i], tokenIds[i]);
        }
        _escrows[escrowId].state = State.Active;
        _escrows[escrowId].addr = tokenAddress;
        _escrows[escrowId].seller = msg.sender;
        _escrows[escrowId].sellerWallet = sellerWallet;
        _escrows[escrowId].ids = tokenIds_;
        _escrows[escrowId].amounts = tokenAmounts;
        _escrows[escrowId].price = batchPrice;
        _escrowsIds.increment();
        IERC1155Upgradeable(tokenAddress).safeBatchTransferFrom(msg.sender, address(this), tokenIds_, tokenAmounts, '');
        emit BatchDeposited(
            msg.sender,
            sellerWallet,
            escrowId,
            tokenAddress,
            tokenTypeIds,
            tokenIds,
            tokenAmounts,
            batchPrice
        );
    }

    /// @inheritdoc IBaseEscrow
    function revertBeforePayment(uint256 escrowId) public override(AmountsEscrow, IBaseEscrow) onlyOwner {
        super.revertBeforePayment(escrowId);
    }

    /// @inheritdoc ICommercialUnitsEscrowUpgradeable
    function makePayment(uint256 escrowId, address payable buyerWallet) external payable {
        if (state(escrowId) != State.Active) {
            revert BaseEscrowInvalidState();
        }
        if (_escrows[escrowId].price != msg.value) {
            revert CommercialUnitsEscrowInvalidPrice();
        }
        if (buyerWallet == address(0)) {
            revert CommercialUnitsEscrowInvalidAddress();
        }
        _escrows[escrowId].state = State.EtherDeposited;
        uint256 weiAmount = msg.value;
        _escrows[escrowId].balance = weiAmount;
        _escrows[escrowId].buyer = msg.sender;
        _escrows[escrowId].buyerWallet = buyerWallet;
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
}
