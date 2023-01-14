// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../interfaces/IIndustrialUnitsEscrowUpgradeable.sol';
import '../interfaces/IIndustrialUnitTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title IndustrialUnitsEscrowUpgradeable contract.
 * @dev Implementation of an escrow contract that aims to transfer an amount of a token or tokens during the
 *     industrial phase of the olive oil supply chain, in exchange for an amount of ether, without the involvement
 *     of third parties. The price of the token or tokens is set when it is, or they are, deposited. There is no
 *     amount indication required as this escrow is intended to be used solely with non fungible tokens and so it
 *     will be 1 unit for every token id. This escrow is used to transfer the ownership of industrial units (pallets)
 *     from the bottling plant to the distributor and then to the retailer. The process of buying a token is represented
 *     in up to three of six different stages:
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
contract IndustrialUnitsEscrowUpgradeable is
    Initializable,
    IIndustrialUnitsEscrowUpgradeable,
    ERC1155HolderUpgradeable,
    OwnableUpgradeable
{
    struct MyIndustrialUnitsEscrow {
        // The state of the escrow
        State state;
        // The address of the token
        address addr;
        // The address of the buyer
        address buyer;
        // The address of the buyer's wallet
        address payable buyerWallet;
        // The id/s of the token/s
        uint256[] ids;
        // The price of the token/s
        uint256 price;
        // The address of the seller
        address seller;
        // The address of the seller's wallet
        address payable sellerWallet;
        // The balance of the escrow
        uint256 balance;
    }

    /// @dev Mapping from escrow id to MyIndustrialUnitsEscrow struct
    mapping(uint256 => MyIndustrialUnitsEscrow) internal _escrows;

    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @dev A counter to provide escrow ids
    CountersUpgradeable.Counter private _escrowsIds;

    function __IndustrialUnitsEscrowUpgradeable_init() internal onlyInitializing {
        __ERC1155Holder_init();
        __Ownable_init();
    }

    /// @inheritdoc IIndustrialUnitsEscrowUpgradeable
    function depositToken(
        address tokenAddress,
        bytes32 tokenId,
        uint256 tokenPrice,
        address payable sellerWallet
    ) external onlyOwner {
        if (tokenAddress == address(0) || sellerWallet == address(0)) {
            revert IndustrialUnitsEscrowInvalidAddress();
        }
        if (tokenPrice == 0) {
            revert IndustrialUnitsEscrowInvalidPrice();
        }
        uint256 escrowId = _escrowsIds.current();
        uint256 tokenId_ = IIndustrialUnitTokenUpgradeable(tokenAddress).bytesToIntId(tokenId);
        uint256[] memory arr = new uint256[](1);
        arr[0] = tokenId_;
        _escrows[escrowId].state = State.Active;
        _escrows[escrowId].addr = tokenAddress;
        _escrows[escrowId].seller = msg.sender;
        _escrows[escrowId].sellerWallet = sellerWallet;
        _escrows[escrowId].ids = arr;
        _escrows[escrowId].price = tokenPrice;
        _escrowsIds.increment();
        IERC1155Upgradeable(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId_, 1, '');
        emit TokenDeposited(msg.sender, sellerWallet, escrowId, tokenAddress, tokenId, tokenPrice);
    }

    /// @inheritdoc IIndustrialUnitsEscrowUpgradeable
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenIds,
        uint256 batchPrice,
        address payable sellerWallet
    ) external onlyOwner {
        if (tokenAddress == address(0) || sellerWallet == address(0)) {
            revert IndustrialUnitsEscrowInvalidAddress();
        }
        if (batchPrice == 0) {
            revert IndustrialUnitsEscrowInvalidPrice();
        }
        uint256 escrowId = _escrowsIds.current();
        uint256[] memory tokenIds_ = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenIds_[i] = IIndustrialUnitTokenUpgradeable(tokenAddress).bytesToIntId(tokenIds[i]);
        }
        _escrows[escrowId].state = State.Active;
        _escrows[escrowId].addr = tokenAddress;
        _escrows[escrowId].seller = msg.sender;
        _escrows[escrowId].sellerWallet = sellerWallet;
        _escrows[escrowId].ids = tokenIds_;
        _escrows[escrowId].price = batchPrice;
        _escrowsIds.increment();
        // _transferBatchFrom(tokenAddress, msg.sender, address(this), tokenIds_);
        uint256[] memory amounts = new uint256[](tokenIds_.length);
        for (uint256 i = 0; i < tokenIds_.length; i++) {
            amounts[i] = 1;
        }
        IERC1155Upgradeable(tokenAddress).safeBatchTransferFrom(msg.sender, address(this), tokenIds_, amounts, '');
        emit BatchDeposited(msg.sender, sellerWallet, escrowId, tokenAddress, tokenIds, batchPrice);
    }

    /// @inheritdoc IBaseEscrow
    function revertBeforePayment(uint256 escrowId) external onlyOwner {
        if (state(escrowId) != State.Active) {
            revert BaseEscrowInvalidState();
        }
        _escrows[escrowId].state = State.RevertedBeforePayment;
        (, address addr, uint256[] memory ids, , address seller, , , , ) = _escrow(escrowId);
        _transferTokens(escrowId, addr, address(this), seller, ids);
        emit RevertedBeforePayment(seller, escrowId);
    }

    /// @inheritdoc IIndustrialUnitsEscrowUpgradeable
    function makePayment(uint256 escrowId, address payable buyerWallet) external payable {
        if (state(escrowId) != State.Active) {
            revert BaseEscrowInvalidState();
        }
        if (_escrows[escrowId].price != msg.value) {
            revert IndustrialUnitsEscrowInvalidPrice();
        }
        if (buyerWallet == address(0)) {
            revert IndustrialUnitsEscrowInvalidAddress();
        }
        _escrows[escrowId].state = State.EtherDeposited;
        uint256 weiAmount = msg.value;
        _escrows[escrowId].balance = weiAmount;
        _escrows[escrowId].buyer = msg.sender;
        _escrows[escrowId].buyerWallet = buyerWallet;
        emit EtherDeposited(msg.sender, buyerWallet, escrowId, weiAmount);
    }

    /// @inheritdoc IBaseEscrow
    function cancelPayment(uint256 escrowId) external {
        if (state(escrowId) != State.EtherDeposited) {
            revert BaseEscrowInvalidState();
        }
        (, , , , , , address buyer, address payable buyerWallet, ) = _escrow(escrowId);
        if (buyer != msg.sender) {
            revert BaseEscrowInvalidBuyer();
        }
        _escrows[escrowId].state = State.Active;
        address formerBuyer = buyer;
        address payable formerBuyerWallet = buyerWallet;
        uint256 weiAmount = _escrows[escrowId].balance;
        _escrows[escrowId].balance -= weiAmount;
        _escrows[escrowId].buyer = address(0);
        _escrows[escrowId].buyerWallet = payable(address(0));
        buyerWallet.transfer(weiAmount);
        emit EtherWithdrawn(escrowId, formerBuyerWallet, weiAmount);
        emit PaymentCancelled(formerBuyer, formerBuyerWallet, escrowId, weiAmount);
    }

    /// @inheritdoc IBaseEscrow
    function revertAfterPayment(uint256 escrowId) external onlyOwner {
        if (state(escrowId) != State.EtherDeposited) {
            revert BaseEscrowInvalidState();
        }
        (
            ,
            address addr,
            uint256[] memory ids,
            ,
            address seller,
            ,
            address buyer,
            address payable buyerWallet,

        ) = _escrow(escrowId);
        _escrows[escrowId].state = State.RevertedAfterPayment;
        uint256 weiAmount = _escrows[escrowId].balance;
        _escrows[escrowId].balance -= weiAmount;
        buyerWallet.transfer(weiAmount);
        _transferTokens(escrowId, addr, address(this), seller, ids);
        emit EtherWithdrawn(escrowId, buyerWallet, weiAmount);
        emit RevertedAfterPayment(seller, buyer, escrowId, weiAmount);
    }

    /// @inheritdoc IBaseEscrow
    function close(uint256 escrowId) external onlyOwner {
        if (state(escrowId) != State.EtherDeposited) {
            revert BaseEscrowInvalidState();
        }
        (
            ,
            address addr,
            uint256[] memory ids,
            ,
            address seller,
            address payable sellerWallet,
            address buyer,
            ,

        ) = _escrow(escrowId);
        _escrows[escrowId].state = State.Closed;
        uint256 weiAmount = _escrows[escrowId].balance;
        _escrows[escrowId].balance -= weiAmount;
        sellerWallet.transfer(weiAmount);
        _transferTokens(escrowId, addr, address(this), buyer, ids);
        emit EtherWithdrawn(escrowId, sellerWallet, weiAmount);
        emit Closed(seller, buyer, sellerWallet, escrowId, weiAmount);
    }

    /// @inheritdoc IIndustrialUnitsEscrowUpgradeable
    function escrow(uint256 escrowId)
        external
        view
        returns (
            State state_,
            address addr,
            bytes32[] memory ids,
            uint256 price,
            address seller,
            address payable sellerWallet,
            address buyer,
            address payable buyerWallet,
            uint256 balance
        )
    {
        MyIndustrialUnitsEscrow memory escrow_ = _escrows[escrowId];
        ids = new bytes32[](escrow_.ids.length);
        for (uint256 i = 0; i < escrow_.ids.length; i++) {
            ids[i] = IIndustrialUnitTokenUpgradeable(escrow_.addr).intToBytesId(escrow_.ids[i]);
        }
        return (
            escrow_.state,
            escrow_.addr,
            ids,
            escrow_.price,
            escrow_.seller,
            escrow_.sellerWallet,
            escrow_.buyer,
            escrow_.buyerWallet,
            escrow_.balance
        );
    }

    /// @inheritdoc IBaseEscrow
    function state(uint256 escrowId) public view returns (State state_) {
        return (_escrows[escrowId].state);
    }

    function _escrow(uint256 escrowId)
        private
        view
        returns (
            State state_,
            address addr,
            uint256[] memory ids,
            uint256 price,
            address seller,
            address payable sellerWallet,
            address buyer,
            address payable buyerWallet,
            uint256 balance
        )
    {
        MyIndustrialUnitsEscrow memory escrow_ = _escrows[escrowId];
        return (
            escrow_.state,
            escrow_.addr,
            escrow_.ids,
            escrow_.price,
            escrow_.seller,
            escrow_.sellerWallet,
            escrow_.buyer,
            escrow_.buyerWallet,
            escrow_.balance
        );
    }

    function _transferTokens(
        uint256 escrowId,
        address addr,
        address from,
        address to,
        uint256[] memory ids
    ) private {
        bytes32[] memory ids_ = new bytes32[](ids.length);
        uint256[] memory amounts = new uint256[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            ids_[i] = IIndustrialUnitTokenUpgradeable(addr).intToBytesId(ids[i]);
            amounts[i] = 1;
        }
        if (ids.length > 1) {
            IERC1155Upgradeable(addr).safeBatchTransferFrom(from, to, ids, amounts, '');
            emit TokensWithdrawn(escrowId, to, addr, ids_);
        } else {
            IERC1155Upgradeable(addr).safeTransferFrom(address(this), to, ids[0], 1, '');
            emit TokenWithdrawn(escrowId, to, addr, ids_[0]);
        }
    }
}
