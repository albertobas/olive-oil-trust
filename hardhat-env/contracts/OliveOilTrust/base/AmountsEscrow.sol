// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "../interfaces/IAmountsEscrow.sol";
import "../interfaces/IBaseToken.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/**
 * @title AmountsEscrow base contract.
 * @dev Escrow contract that implements common actions taken by members in both, commercial
 *     and agricultural phases.
 */
abstract contract AmountsEscrow is ERC1155HolderUpgradeable, IAmountsEscrow {
    /// @dev Struct that aims to store information about a single escrow
    struct MyAmountsEscrow {
        // The state of the escrow, see IBaseEscrow enum State
        State state;
        // The address of the token
        address addr;
        // The amount/s of token/s
        uint256[] amounts;
        // The address of the buyer, or buyer candidate
        address buyer;
        // The id/s of the token/s
        uint256[] ids;
        // The price of the token/s
        uint256 price;
        // The address of the seller
        address seller;
        // The address of the seller's wallet
        address payable sellerWallet;
        // The address of the buyer's wallet
        address payable buyerWallet;
        // The balance of the escrow
        uint256 balance;
    }

    /// @dev Mapping from escrow id to MyAmountsEscrow struct
    mapping(uint256 => MyAmountsEscrow) internal _escrows;

    /// @inheritdoc IBaseEscrow
    function revertBeforePayment(uint256 escrowId) public virtual {
        if (state(escrowId) != State.Active) {
            revert BaseEscrowInvalidState();
        }
        (, address addr, uint256[] memory ids, uint256[] memory amounts, , address seller, , , , ) = _escrow(escrowId);
        _escrows[escrowId].state = State.RevertedBeforePayment;
        emit RevertedBeforePayment(seller, escrowId);
        _transferTokens(escrowId, addr, address(this), seller, ids, amounts);
    }

    /// @inheritdoc IBaseEscrow
    function cancelPayment(uint256 escrowId) public {
        if (state(escrowId) != State.EtherDeposited) {
            revert BaseEscrowInvalidState();
        }
        (, , , , , , , address buyer, address payable buyerWallet, ) = _escrow(escrowId);
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
        emit EtherWithdrawn(escrowId, formerBuyerWallet, weiAmount);
        emit PaymentCancelled(formerBuyer, formerBuyerWallet, escrowId, weiAmount);
        (bool success, ) = buyerWallet.call{value: weiAmount}("");
        if (!success) revert BaseEscrowTransferFailed();
    }

    /// @inheritdoc IBaseEscrow
    function revertAfterPayment(uint256 escrowId) public virtual {
        if (state(escrowId) != State.EtherDeposited) {
            revert BaseEscrowInvalidState();
        }
        (
            ,
            address addr,
            uint256[] memory ids,
            uint256[] memory amounts,
            ,
            address seller,
            ,
            address buyer,
            address payable buyerWallet,

        ) = _escrow(escrowId);
        _escrows[escrowId].state = State.RevertedAfterPayment;
        uint256 weiAmount = _escrows[escrowId].balance;
        _escrows[escrowId].balance -= weiAmount;
        emit EtherWithdrawn(escrowId, buyerWallet, weiAmount);
        emit RevertedAfterPayment(seller, buyer, escrowId, weiAmount);
        _transferTokens(escrowId, addr, address(this), seller, ids, amounts);
        (bool success, ) = buyerWallet.call{value: weiAmount}("");
        if (!success) revert BaseEscrowTransferFailed();
    }

    /// @inheritdoc IBaseEscrow
    function close(uint256 escrowId) public virtual {
        if (state(escrowId) != State.EtherDeposited) {
            revert BaseEscrowInvalidState();
        }
        (
            ,
            address addr,
            uint256[] memory ids,
            uint256[] memory amounts,
            ,
            address seller,
            address payable sellerWallet,
            address buyer,
            ,

        ) = _escrow(escrowId);
        _escrows[escrowId].state = State.Closed;
        uint256 weiAmount = _escrows[escrowId].balance;
        _escrows[escrowId].balance -= weiAmount;
        emit EtherWithdrawn(escrowId, sellerWallet, weiAmount);
        emit Closed(seller, buyer, sellerWallet, escrowId, weiAmount);
        _transferTokens(escrowId, addr, address(this), buyer, ids, amounts);
        (bool success, ) = sellerWallet.call{value: weiAmount}("");
        if (!success) revert BaseEscrowTransferFailed();
    }

    /// @inheritdoc IAmountsEscrow
    function escrow(
        uint256 escrowId
    )
        external
        view
        returns (
            State state_,
            address addr,
            bytes32[] memory ids,
            uint256[] memory amounts,
            uint256 price,
            address seller,
            address payable sellerWallet,
            address buyer,
            address payable buyerWallet,
            uint256 balance
        )
    {
        MyAmountsEscrow memory escrow_ = _escrows[escrowId];
        ids = new bytes32[](escrow_.ids.length);
        for (uint256 i = 0; i < escrow_.ids.length; ) {
            // slither-disable-next-line calls-loop
            ids[i] = IBaseToken(escrow_.addr).intToBytesTokenId(escrow_.ids[i]);
            unchecked {
                i++;
            }
        }
        return (
            escrow_.state,
            escrow_.addr,
            ids,
            escrow_.amounts,
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

    function _escrow(
        uint256 escrowId
    )
        private
        view
        returns (
            State state_,
            address addr,
            uint256[] memory ids,
            uint256[] memory amounts,
            uint256 price,
            address seller,
            address payable sellerWallet,
            address buyer,
            address payable buyerWallet,
            uint256 balance
        )
    {
        MyAmountsEscrow memory escrow_ = _escrows[escrowId];
        return (
            escrow_.state,
            escrow_.addr,
            escrow_.ids,
            escrow_.amounts,
            escrow_.price,
            escrow_.seller,
            escrow_.sellerWallet,
            escrow_.buyer,
            escrow_.buyerWallet,
            escrow_.balance
        );
    }

    function _asSingletonArray(uint256 element) internal pure returns (uint256[] memory) {
        uint256[] memory arr = new uint256[](1);
        arr[0] = element;
        return arr;
    }

    function _transferTokens(
        uint256 escrowId,
        address addr,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) private {
        bytes32[] memory ids_ = new bytes32[](ids.length);
        for (uint256 i = 0; i < ids.length; ) {
            // slither-disable-next-line calls-loop
            ids_[i] = IBaseToken(addr).intToBytesTokenId(ids[i]);
            unchecked {
                i++;
            }
        }
        if (ids.length > 1) {
            emit TokensWithdrawn(escrowId, to, addr, ids_, amounts);
            IERC1155Upgradeable(addr).safeBatchTransferFrom(from, to, ids, amounts, "");
        } else {
            emit TokenWithdrawn(escrowId, to, addr, ids_[0], amounts[0]);
            IERC1155Upgradeable(addr).safeTransferFrom(address(this), to, ids[0], amounts[0], "");
        }
    }

    function _checkAddress(address token) internal view {
        if (token == address(0) || token.code.length == 0) revert BaseEscrowInvalidAddress();
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[49] private __gap;
}
