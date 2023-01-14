// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import './IBaseToken.sol';

/// Interface required for an IndependentToken contract
interface IIndependentTokenUpgradeable is IBaseToken {
    /// @dev Invalid array
    error IndependentTokenInvalidArray();

    /**
     * @dev Mints `tokenAmount` units of token with id `tokenId` of type `tokenTypeId`.
     *     Requirements:
     *     - `tokenId` must have not been already assigned to another token.
     * @param to The address of the owner of the units to be minted.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The number of units to be minted.
     */
    function mint(
        address to,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) external;

    /**
     * @dev Mints `tokenAmounts` units of tokens with ids `tokenIds` of type `tokenTypeIds`.
     *     Requirements:
     *     - `tokenIds`, `tokenIds` and  `tokenAmounts` must be the same length and greater than zero.
     *     - none of the ids in `tokenIds` must have been already assigned to other tokens.
     * @param to The address of the owner of the units to be minted.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The number of units to be minted.
     */
    function mintBatch(
        address to,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] memory tokenAmounts
    ) external;
}
