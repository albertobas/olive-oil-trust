// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol';

/// @dev Interface required for a BaseToken contract
interface IBaseToken is IERC1155Upgradeable {
    /// @dev Dublicated token id
    error BaseTokenDuplicatedTokenId();

    /// @dev Invalid caller
    error BaseTokenInvalidCaller();

    /// @dev Equivalent to IERC1155Upgradeable TransferSingle event but with a bytes32 id and a tokenTypeId
    event TokenTransferred(
        address indexed operator,
        address indexed from,
        address indexed to,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    );

    /// @dev Equivalent to IERC1155Upgradeable TransferBatch event but with a bytes32 id and tokenTypeIds arrays
    event BatchTransferred(
        address indexed operator,
        address indexed from,
        address indexed to,
        bytes32[] tokenTypeIds,
        bytes32[] tokenIds,
        uint256[] tokenAmounts
    );

    /**
     * @dev Burns `tokenAmount` units of token `tokenId` of type `tokenTypeId` owned by `account`.
     *     Requirements:
     *     - caller address must be `account` or an approved address.
     * @param account The address of the account whose tokens are meant to be burnt.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The amount of token to be burnt.
     */
    function burn(
        address account,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) external;

    /**
     * @dev Burns `tokenAmounts` units of tokens `tokenIds` of types `tokenTypeIds` owned by `account`.
     *     Requirements:
     *     - caller address must be `account` or an approved address.
     * @param account The address of the account whose tokens are meant to be burnt.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The amounts of tokens to be burnt.
     */
    function burnBatch(
        address account,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external;

    /**
     * @dev Returns the uint256 id of the token `tokenId` of type `tokenTypeId`.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     */
    function bytesToIntTokenId(bytes32 tokenTypeId, bytes32 tokenId) external view returns (uint256);

    /**
     * @dev Returns the uint256 id of the type of token `tokenId`.
     * @param tokenId The bytes32 id of the token.
     */
    function bytesToIntTokenTypeId(bytes32 tokenId) external view returns (uint256);

    /**
     * @dev Returns the bytes32 id of the token `tokenId`.
     * @param tokenId The bytes32 id of the token.
     */
    function intToBytesTokenId(uint256 tokenId) external view returns (bytes32);
}
