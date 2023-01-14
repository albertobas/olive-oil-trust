// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import './IBaseEscrow.sol';

/// @dev Interface required for an AmountsEscrow contract
interface IAmountsEscrow is IBaseEscrow {
    /**
     * @dev Event emitted when a token is withdrawn from the escrow.
     * @param escrowId The id of the escrow.
     * @param payee The beneficiary of the transfer.
     * @param tokenAddress The address of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The amount of token withdrawn.
     */
    event TokenWithdrawn(
        uint256 indexed escrowId,
        address indexed payee,
        address indexed tokenAddress,
        bytes32 tokenId,
        uint256 tokenAmount
    );

    /**
     * @dev Event emitted when multiple tokens are withdrawn from the escrow.
     * @param escrowId The id of the escrow.
     * @param payee The beneficiary of the transfer.
     * @param tokenAddress The address of the token.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The amounts of tokens withdrawn.
     */
    event TokensWithdrawn(
        uint256 indexed escrowId,
        address indexed payee,
        address indexed tokenAddress,
        bytes32[] tokenIds,
        uint256[] tokenAmounts
    );

    /**
     * @dev Returns all the information stored in the escrow `escrowId` IBaseEscrow.MyEscrow struct.
     * @param escrowId The id of the escrow.
     */
    function escrow(uint256 escrowId)
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
        );
}
