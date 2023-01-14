// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import './IAmountsEscrow.sol';

/// Interface required for a Escrow contract
interface ICommercialUnitsEscrowUpgradeable is IAmountsEscrow {
    /**
     * @dev Event emitted when a single token is deposited in the escrow.
     * @param seller The address of the seller.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param tokenAddress The address of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The amount of token.
     * @param tokenPrice The price of token.
     */
    event TokenDeposited(
        address seller,
        address payable sellerWallet,
        uint256 indexed escrowId,
        address indexed tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        uint256 tokenPrice
    );

    /**
     * @dev Event emitted when multiple tokens are deposited in the same escrow.
     * @param seller The address of the seller.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param tokenAddress The address of the token.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The amounts of tokens.
     * @param batchPrice The price of the batch.
     */
    event BatchDeposited(
        address seller,
        address payable sellerWallet,
        uint256 indexed escrowId,
        address indexed tokenAddress,
        bytes32[] tokenTypeIds,
        bytes32[] tokenIds,
        uint256[] tokenAmounts,
        uint256 batchPrice
    );

    /// @dev Address not valid
    error CommercialUnitsEscrowInvalidAddress();

    /// @dev Array not valid
    error CommercialUnitsEscrowInvalidArray();

    /// @dev Price not valid
    error CommercialUnitsEscrowInvalidPrice();

    /**
     * @dev Deposits the token `id` in an escrow.
     *     Emits a TokenDeposited event.
     *     Requirements:
     *     - `addr` must not be the zero address.
     *     - `sellerWallet` must not be the zero address.
     * @param tokenAddress The address of the token to be transferred.
     * @param tokenTypeId The id of the type of the token to be transferred.
     * @param tokenId The id of the token to be transferred.
     * @param tokenAmount The amount of token to be transferred.
     * @param tokenPrice The price of the token to be transferred.
     * @param sellerWallet The address of the seller's wallet.
     */
    function depositToken(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        uint256 tokenPrice,
        address payable sellerWallet
    ) external;

    /**
     * @dev Deposits the tokens `ids` in an escrow.
     *     Emits a BatchDeposited event.
     *     Requirements:
     *     - `addr` must not be the zero address.
     *     - `sellerWallet` must not be the zero address.
     *     - `ids` and `amounts` array lengths must be of equal length.
     *     - `ids` and `amounts` array lengths must be greater than one.
     * @param tokenAddress The address of the token contract.
     * @param tokenTypeIds The ids of the types of the tokens to be transferred.
     * @param tokenIds The ids of the tokens to be transferred.
     * @param tokenAmounts The amounts of the tokens to be transferred.
     * @param batchPrice The price of the token to be transferred.
     * @param sellerWallet The address of the seller's wallet.
     */
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        uint256 batchPrice,
        address payable sellerWallet
    ) external;

    /**
     * @dev Deposits the amount of funds required in the escrow `escrowId`, which may later be
     *     refunded and sets the state to EtherDeposited.
     *     Emits a EtherDeposited event.
     *     Requirements:
     *     - escrow `escrowId` state must be Active.
     *     - msg.value must be the same as the price set for the escrow `escrowId`.
     *     - `buyerWallet` must not be the zero address.
     * @param escrowId The id of the escrow.
     * @param buyerWallet The address funds will be sent to if a refund occurs.
     */
    function makePayment(uint256 escrowId, address payable buyerWallet) external payable;
}
