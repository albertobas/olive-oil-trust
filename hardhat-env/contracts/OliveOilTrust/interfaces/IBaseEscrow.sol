// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155ReceiverUpgradeable.sol";

/// @dev Interface required for a BaseEscrow contract
interface IBaseEscrow is IERC1155ReceiverUpgradeable {
    /// @dev Enumerates the possible states that can take a BaseEscrow
    enum State {
        NonActive,
        Active,
        RevertedBeforePayment,
        EtherDeposited,
        RevertedAfterPayment,
        Closed
    }

    /**
     * @dev Event emitted when the transfer of the token is reverted before funds have been deposited.
     * @param seller The address of the seller.
     * @param escrowId The id of the escrow.
     */
    event RevertedBeforePayment(address indexed seller, uint256 indexed escrowId);

    /**
     * @dev Event emitted when funds are deposited in the escrow.
     * @param buyer The address of the buyer.
     * @param buyerWallet The address of the buyer's wallet.
     * @param escrowId The id of the escrow.
     * @param weiAmount The amount of funds in wei deposited in the escrow.
     */
    event EtherDeposited(
        address indexed buyer,
        address payable buyerWallet,
        uint256 indexed escrowId,
        uint256 weiAmount
    );

    /**
     * @dev Event emitted when the deposit of funds is cancelled.
     * @param buyer The address of the buyer.
     * @param buyerWallet The address of the buyer's wallet.
     * @param escrowId The id of the escrow.
     * @param weiAmount The amount of funds in wei deposited in the escrow.
     */
    event PaymentCancelled(
        address indexed buyer,
        address payable buyerWallet,
        uint256 indexed escrowId,
        uint256 weiAmount
    );

    /**
     * @dev Event emitted when the transfer of the token is reverted after funds have been deposited.
     * @param seller The address of the seller.
     * @param buyer The address of the buyer.
     * @param escrowId The id of the escrow.
     * @param weiAmount The amount of funds in wei deposited in the escrow.
     */
    event RevertedAfterPayment(
        address indexed seller,
        address indexed buyer,
        uint256 indexed escrowId,
        uint256 weiAmount
    );

    /**
     * @dev Event emitted when the escrow is closed.
     * @param seller The address of the seller.
     * @param buyer The address of the buyer.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param weiAmount The amount of funds in wei deposited in the escrow.
     */
    event Closed(
        address indexed seller,
        address indexed buyer,
        address payable sellerWallet,
        uint256 indexed escrowId,
        uint256 weiAmount
    );

    /**
     * @dev Event emitted when funds are withdrawn from the escrow.
     * @param escrowId The id of the escrow.
     * @param payee The beneficiary of the transfer of ether.
     * @param weiAmount The amount of funds in wei that are withdrawn.
     */
    event EtherWithdrawn(uint256 indexed escrowId, address indexed payee, uint256 weiAmount);

    /// @dev Invalid state
    error BaseEscrowInvalidState();

    /// @dev Invalid buyer
    error BaseEscrowInvalidBuyer();

    /// @dev Invalid token address
    error BaseEscrowInvalidAddress();

    /// @dev Invalid token address
    error BaseEscrowTransferFailed();

    /**
     * @dev It reverts the transfer of the token/s to the escrow before funds have been deposited and
     *     sets the escrow to the final state RevertedBeforePayment.
     *     Emits two events: RevertedBeforePayment and either TokenWithdrawn or TokensWithdrawn.
     *     Requirements:
     *     - escrow `escrowId` state must be Active
     * @param escrowId The id of the escrow.
     */
    function revertBeforePayment(uint256 escrowId) external;

    /**
     * @dev It transfers the deposits back to the escrow `escrowId` buyer candidate and sets the state
     *     back to Active.
     *     Emits two events: EtherWithdrawn and PaymentCancelled.
     *     Requirements:
     *     - escrow `escrowId` state must be EtherDeposited.
     *     - msg.sender must be the escrow `escrowId` buyer.
     * @param escrowId The id of the escrow.
     */
    function cancelPayment(uint256 escrowId) external;

    /**
     * @dev It reverts the transfer of the token/s to the escrow after funds have been deposited,
     *     transfers the deposits back to the escrow `escrowId` buyer candidate and sets the escrow
     *     to the final state RevertedAfterPayment.
     *     Emits three events: EtherWithdrawn, RevertedAfterPayment and either TokenWithdrawn or
     *     TokensWithdrawn.
     *     Requirements:
     *     - escrow `escrowId` state must be EtherDeposited
     * @param escrowId The id of the token to be transferred.
     */
    function revertAfterPayment(uint256 escrowId) external;

    /**
     * @dev It transfers the token/s to the buyer, the funds to the seller and sets the escrow to
     *     the final state Closed.
     *     Emits three events: EtherWithdrawn, Closed and either TokenWithdrawn or
     *     TokensWithdrawn.
     *     Requirements:
     *     - escrow `escrowId` state must be EtherDeposited.
     * @param escrowId The id of the escrow.
     */
    function close(uint256 escrowId) external;

    /**
     * @dev Returns the state of the escrow `escrowId`.
     * @param escrowId The id of the escrow.
     */
    function state(uint256 escrowId) external view returns (State state_);
}
