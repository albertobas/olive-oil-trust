// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.14;

import './IBaseToken.sol';

/// @dev Interface required for a DependentToken contract
interface IDependentTokenUpgradeable is IBaseToken {
    /**
     * @dev Event emitted when a type of a dependent token is instructed a set of addresses, ids and amounts.
     * @param operator The address of the operator.
     * @param tokenTypeId The id of the type of the token.
     * @param instructedTokenAddresses The addresses of the tokens, or certificates, needed to mint a new token.
     * @param instructedTokenTypeIds The addresses of the tokens, or certificates, needed to mint a new token.
     * @param instructedTokenAmounts The number of units of the tokens needed to mint a new token.
     */
    event TokenTypeInstructionsSet(
        address indexed operator,
        bytes32 tokenTypeId,
        address[] instructedTokenAddresses,
        bytes32[] instructedTokenTypeIds,
        uint256[] instructedTokenAmounts
    );

    /**
     * @dev Event emitted when multiple types of dependent tokens are instructed sets of addresses, ids and amounts.
     * @param operator The address of the operator.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param instructedTokenAddresses The addresses of the tokens, or certificates, needed to mint new tokens.
     * @param instructedTokenTypeIds The addresses of the tokens, or certificates, needed to mint new tokens.
     * @param instructedTokenAmounts The number of units of the tokens needed to mint new tokens.
     */
    event TokenTypesInstructionsSet(
        address indexed operator,
        bytes32[] tokenTypeIds,
        address[][] instructedTokenAddresses,
        bytes32[][] instructedTokenTypeIds,
        uint256[][] instructedTokenAmounts
    );

    /// @dev Invalid address
    error DependentTokenInvalidAddress();

    /// @dev Invalid amount
    error DependentTokenInvalidAmount();

    /// @dev Invalid array
    error DependentTokenInvalidArray();

    /// @dev Invalid caller
    error DependentTokenInvalidCaller();

    /// @dev Duplicated token id
    error DependentTokenDuplicatedTokenTypeId();

    /// @dev Non existent token id
    error DependentTokenNonExistentTokenTypeId();

    /// @dev Insufficient balance
    error DependentTokenInsufficientBalance();

    /**
     * @dev Sets the instructions that are to be followed in order to mint a new token of type `tokenTypeId`.
     *     Emits a TokenTypeInstructionsSet event.
     *     Requirements:
     *     - type `tokenTypeId` must not have already been set instructions.
     *     - `instructedTokenAddresses`, `instructedTokenTypeIds` and  `instructedTokenAmounts` must be the same
     *       length and greaterthan zero.
     *     - none of the addresses `instructedTokenAddresses` must be the zero address.
     *     - none of the amounts `instructedTokenAmounts` must be the zero.
     * @param tokenTypeId The id of the type of the token.
     * @param instructedTokenAddresses The addresses of the tokens, or certificates, needed to mint a new token.
     * @param instructedTokenTypeIds The addresses of the tokens, or certificates, needed to mint a new token.
     * @param instructedTokenAmounts The number of units of the tokens needed to mint a new token.
     */
    function setTokenTypeInstructions(
        bytes32 tokenTypeId,
        address[] calldata instructedTokenAddresses,
        bytes32[] calldata instructedTokenTypeIds,
        uint256[] calldata instructedTokenAmounts
    ) external;

    /**
     * @dev Sets the instructions that are to be followed in order to mint new tokens of types `tokenTypeIds`.
     *     Emits a TokenTypesInstructionsSet event.
     *     Requirements:
     *     - type `tokenTypeId` must not have already been set instructions.
     *     - `instructedTokenAddresses`, `instructedTokenTypeIds` and  `instructedTokenAmounts` must be the same
     *       length and greaterthan zero in both dimensions.
     *     - none of the addresses `instructedTokenAddresses` must be the zero address.
     *     - none of the amounts `instructedTokenAmounts` must be the zero.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param instructedTokenAddresses The addresses of the tokens, or certificates, needed to mint new tokens.
     * @param instructedTokenTypeIds The addresses of the tokens, or certificates, needed to mint new tokens.
     * @param instructedTokenAmounts The number of units of the tokens needed to mint new tokens.
     */
    function setTokenTypesInstructions(
        bytes32[] calldata tokenTypeIds,
        address[][] calldata instructedTokenAddresses,
        bytes32[][] calldata instructedTokenTypeIds,
        uint256[][] calldata instructedTokenAmounts
    ) external;

    /**
     * @dev Mints `tokenAmount` units of token with id `tokenId` of type `tokenTypeId`.
     *     Requirements:
     *     - token `tokenTypeId` must have already been set instructions.
     *     - token `tokenId` must have not been already assigned to another token.
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
     *     - all of the ids in `tokenTypeIds` must have already been set instructions.
     *     - `tokenTypeIds`, `tokenIds` and  `tokenAmounts` must be the same length and greater than zero.
     *     - none of the ids in `tokenIds` must have been already assigned to other tokens.
     * @param to The address of the owner of the units to be minted.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The number of units to be minted.
     */
    function mintBatch(
        address to,
        bytes32[] memory tokenTypeIds,
        bytes32[] memory tokenIds,
        uint256[] memory tokenAmounts
    ) external;

    /// @dev Returns the instructions, i.e. addresses, ids and amounts, of token `tokenId`
    function getInstructions(bytes32 tokenId)
        external
        view
        returns (
            address[] memory tokenAddresses,
            bytes32[] memory tokenTypeIds,
            uint256[] memory tokenAmounts
        );
}
