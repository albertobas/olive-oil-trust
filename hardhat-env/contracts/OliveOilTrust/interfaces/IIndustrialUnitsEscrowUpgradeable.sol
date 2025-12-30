// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "./IBaseEscrow.sol";

/// Interface required for a Escrow contract
interface IIndustrialUnitsEscrowUpgradeable is IBaseEscrow {
    /**
     * @dev Event emitted when a single token is deposited in the escrow.
     * @param seller The address of the seller.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param tokenAddress The address of the token.
     * @param tokenId The id of the token.
     * @param tokenPrice The price of token.
     */
    event TokenDeposited(
        address seller,
        address payable sellerWallet,
        uint256 indexed escrowId,
        address indexed tokenAddress,
        bytes32 tokenId,
        uint256 tokenPrice
    );

    /**
     * @dev Event emitted when multiple tokens are deposited in the same escrow.
     * @param seller The address of the seller.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param tokenAddress The address of the token.
     * @param tokenIds The ids of the tokens.
     * @param batchPrice The price of the batch.
     */
    event BatchDeposited(
        address seller,
        address payable sellerWallet,
        uint256 indexed escrowId,
        address indexed tokenAddress,
        bytes32[] tokenIds,
        uint256 batchPrice
    );

    /**
     * @dev Event emitted when the token is withdrawn from the escrow.
     * @param escrowId The id of the escrow.
     * @param payee The beneficiary of the transfer.
     * @param tokenAddress The address of the token.
     * @param tokenId The id of the token.
     */
    event TokenWithdrawn(
        uint256 indexed escrowId,
        address indexed payee,
        address indexed tokenAddress,
        bytes32 tokenId
    );

    /**
     * @dev Event emitted when the token is withdrawn from the escrow.
     * @param escrowId The id of the escrow.
     * @param payee The beneficiary of the transfer.
     * @param tokenAddress The address of the token.
     * @param tokenIds The ids of the tokens.
     */
    event TokensWithdrawn(
        uint256 indexed escrowId,
        address indexed payee,
        address indexed tokenAddress,
        bytes32[] tokenIds
    );

    /// @dev Address not valid
    error IndustrialUnitsEscrowInvalidAddress();

    /// @dev Array not valid
    error IndustrialUnitsEscrowInvalidArray();

    /// @dev Price not valid
    error IndustrialUnitsEscrowInvalidPrice();

    /**
     * @dev Deposits the token `id` in an escrow.
     *     Emits a TokenDeposited event.
     *     Requirements:
     *     - `addr` must not be the zero address.
     *     - `sellerWallet` must not be the zero address.
     * @param tokenAddress The address of the token to be transferred.
     * @param tokenId The id of the token to be transferred.
     * @param tokenPrice The price of the token to be transferred.
     * @param sellerWallet The address of the seller's wallet.
     */
    function depositToken(
        address tokenAddress,
        bytes32 tokenId,
        uint256 tokenPrice,
        address payable sellerWallet
    ) external;

    /**
     * @dev Deposits the tokens `ids` in an escrow.
     *     Emits a BatchDeposited event.
     *     Requirements:
     *     - `addr` must not be the zero address.
     *     - `sellerWallet` must not be the zero address.
     *     - `ids` array lengths must be greater than one.
     * @param tokenAddress The address of the token contract.
     * @param tokenIds The ids of the tokens to be transferred.
     * @param batchPrice The price of the token to be transferred.
     * @param sellerWallet The address of the seller's wallet.
     */
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenIds,
        uint256 batchPrice,
        address payable sellerWallet
    ) external;

    /**
     * @dev Deposits funds that may later be refunded and sets the state to EtherDeposited.
     *     Emits a EtherDeposited event.
     *     Requirements:
     *     - escrow `escrowId` state must be Active.
     *     - msg.value must be the same as the price set for the escrow `escrowId`.
     *     - `buyerWallet` must not be the zero address.
     * @param escrowId The id of the escrow.
     * @param buyerWallet The address funds will be sent to if a refund occurs.
     */
    function makePayment(uint256 escrowId, address payable buyerWallet) external payable;

    /**
     * @dev Returns all the information stored in the escrow `escrowId`
     *     IIndustrialUnitsEscrowUpgradeable.IndustrialUnitsEscrow struct.
     * @param escrowId The id of the escrow.
     */
    function escrow(
        uint256 escrowId
    )
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
        );
}
