// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "./IAmountsEscrow.sol";

/// @dev Interface required for an AgriculturalEscrowUpgradeable contract
interface IAgriculturalEscrowUpgradeable is IAmountsEscrow {
    /**
     * @dev Event emitted when a single token is deposited in the escrow.
     * @param seller The address of the seller.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The amount of token.
     */
    event TokenDeposited(
        address seller,
        address payable sellerWallet,
        uint256 indexed escrowId,
        address indexed tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    );

    /**
     * @dev Event emitted when multiple tokens are deposited in the same escrow.
     * @param seller The address of the seller.
     * @param sellerWallet The address of the seller's wallet.
     * @param escrowId The id of the escrow.
     * @param tokenAddress The address of the token.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The amounts of tokens.
     */
    event BatchDeposited(
        address seller,
        address payable sellerWallet,
        uint256 indexed escrowId,
        address indexed tokenAddress,
        bytes32[] tokenTypeIds,
        bytes32[] tokenIds,
        uint256[] tokenAmounts
    );

    /// @dev Invalid address
    error AgriculturalEscrowInvalidAddress();

    /// @dev Invalid array
    error AgriculturalEscrowInvalidArray();

    /// @dev Invalid price
    error AgriculturalEscrowInvalidPrice();

    /// @dev Invalid state
    error AgriculturalEscrowInvalidState();

    /**
     * @dev Deposits `tokenAmount` units of the token `tokenId` in an escrow.
     *     Emits a TokenDeposited event.
     *     Requirements:
     *     - `tokenAddress` and `sellerWallet` must not be the zero address.
     * @param tokenAddress The address of the tokens to be transferred.
     * @param tokenTypeId The id of the type of the token to be transferred.
     * @param tokenId The id of the token to be transferred.
     * @param tokenAmount The amount of token to be transferred.
     * @param sellerWallet The address of the seller's wallet.
     */
    function depositToken(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        address payable sellerWallet
    ) external;

    /**
     * @dev Deposits `tokenAmounts` units of the tokens `tokenIds` in an escrow.
     *     Emits a BatchDeposited event.
     *     Requirements:
     *     - `tokenAddress` and `sellerWallet` must not be the zero address.
     *     - `tokenIds` `tokenAmounts` and `tokenTypeIds` array lengths must be the same.
     * @param tokenAddress The address of the token contract.
     * @param tokenTypeIds The ids of the types of the tokens to be transferred.
     * @param tokenIds The ids of the tokens to be transferred.
     * @param tokenAmounts The amounts of the tokens to be transferred.
     * @param sellerWallet The address of the seller's wallet.
     */
    function depositBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        address payable sellerWallet
    ) external;

    /**
     * @dev Deposits funds, which may later be refunded, and sets the state to EtherDeposited.
     *     Emits an EtherDeposited event.
     *     Requirements:
     *     - escrow `escrowId` state must be Active.
     *     - `buyerWallet` must not be the zero address.
     * @param escrowId The id of the escrow.
     * @param buyerWallet The address funds will be sent to if a refund occurs.
     */
    function makeOffer(uint256 escrowId, address payable buyerWallet) external payable;
}
