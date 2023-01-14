// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol';

/// @dev Interface required for a IndustrialUnitTokenUpgradeable contract
interface IIndustrialUnitTokenUpgradeable is IERC1155Upgradeable {
    /// @dev Equivalent to IERC1155Upgradeable TransferSingle event but with a bytes32 id
    event TokenTransferred(
        address indexed operator,
        address indexed from,
        address indexed to,
        bytes32 tokenId,
        uint256 tokenAmount
    );

    /// @dev Equivalent to IERC1155Upgradeable TransferBatch event but with a bytes32 id array
    event BatchTransferred(
        address indexed operator,
        address indexed from,
        address indexed to,
        bytes32[] tokenIds,
        uint256[] tokenAmounts
    );

    /**
     * @dev Event emitted when an industrial unit is packed.
     * @param owner The address of the owner of the industrial unit.
     * @param palletId The id of the industrial unit.
     * @param tokenAddresses The addresses of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    event SinglePacked(
        address indexed owner,
        bytes32 palletId,
        address[] tokenAddresses,
        bytes32[] tokenTypeIds,
        bytes32[] tokenIds,
        uint256[] tokenAmounts
    );

    /**
     * @dev Event emitted when multiple industrial units are packed.
     * @param owner The address of the owner of the industrial units.
     * @param palletIds The ids of the industrial units.
     * @param tokenAddresses The addresses of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    event BatchPacked(
        address indexed owner,
        bytes32[] palletIds,
        address[][] tokenAddresses,
        bytes32[][] tokenTypeIds,
        bytes32[][] tokenIds,
        uint256[][] tokenAmounts
    );

    /**
     * @dev Event emitted when an industrial unit is unpacked.
     * @param owner The address of the owner of the industrial unit.
     * @param palletId The id of the industrial unit.
     */
    event SingleUnpacked(address indexed owner, bytes32 indexed palletId);

    /**
     * @dev Event emitted when multiple industrial units are unpacked.
     * @param owner The address of the owner of the industrial units.
     * @param palletIds The ids of the industrial units.
     */
    event BatchUnpacked(address indexed owner, bytes32[] palletIds);

    /// @dev Invalid amount
    error IndustrialUnitTokenInvalidAmount();

    /// @dev Invalid array
    error IndustrialUnitTokenInvalidArray();

    /// @dev Invalid balance
    error IndustrialUnitTokenInvalidBalance();

    /// @dev Invalid caller
    error IndustrialUnitTokenInvalidCaller();

    /// @dev Duplicated id
    error IndustrialUnitTokenDuplicatedId();

    /**
     * @dev Packs a set of tokens, i.e. it checks that the caller has enough balance of the tokens
     *     to be packed, mints an industrial unit to the caller and transfers the tokens that are
     *     wrapped on the industrial unit to the industrial unit contract address.
     *     Emits a SinglePacked event.
     *     Requirements:
     *     - `tokenAddresses`, `tokenIds` and  `tokenAmounts` must be the same length and greater than
     *       zero.
     *     - id `palletId` must not have been already assigned to another pallet.
     *     - caller should have enough balance of every token in `tokenIds`.
     * @param owner_ The address of the owner_ of the token to be minted.
     * @param palletId The id of the industrial unit.
     * @param tokenAddresses The addresses of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    function pack(
        address owner_,
        bytes32 palletId,
        address[] memory tokenAddresses,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) external;

    /**
     * @dev Packs multiple sets of tokens, i.e. it checks that the caller has enough balance of the
     *     tokens to be packed and mints multiple industrial units to the caller and transfers the
     *     tokens that are wrapped on the industrial units to the industrial unit contract address.
     *     Emits a BatchPacked event.
     *     Requirements:
     *     - `tokenAddresses`, `tokenIds` and `tokenAmounts` must be the same length and greater than
     *       zero in both dimensions.
     *     - none of the ids `palletIds` must have been already assigned to another pallet.
     *     - caller should have enough balance of every token in `tokenIds`.
     * @param owner_ The address of the owner_ of the tokens to be minted.
     * @param palletIds The id of the industrial units.
     * @param tokenAddresses The addresses of the tokens that will be packed.
     * @param tokenIds The ids of the tokens that will be packed.
     * @param tokenAmounts The amounts of the tokens that will be packed.
     */
    function packBatch(
        address owner_,
        bytes32[] calldata palletIds,
        address[][] memory tokenAddresses,
        bytes32[][] calldata tokenTypeIds,
        bytes32[][] calldata tokenIds,
        uint256[][] calldata tokenAmounts
    ) external;

    /**
     * @dev Unpacks a token, i.e. it transfers the industrial units to `owner_` and burns the industrial
     *     unit `palletId`.
     *     Emits a SingleUnpacked event.
     *     Requirements:
     *     - caller must be `owner_`.
     *     - caller's balance of token `palletId` must not be zero.
     * @param owner_ The address of the owner_ of the token to be minted.
     * @param palletId The id of the industrial unit.
     */
    function unpack(address owner_, bytes32 palletId) external;

    /**
     * @dev Unpacks multiple tokens, i.e. it transfers the industrial units to `owner_` and burns the
     *     industrial units `palletIds`.
     *     Emits a BatchUnpacked event.
     *     Requirements:
     *     - caller must be `owner_`.
     *     - caller's balance of tokens `palletIds` must not be zero.
     * @param owner_ The address of the owner_ of the tokens to be minted.
     * @param palletIds The id of the industrial units.
     */
    function unpackBatch(address owner_, bytes32[] calldata palletIds) external;

    /**
     * @dev Returns the uint256 id of the token id `palletId`.
     * @param palletId The bytes32 id of the pallet.
     */
    function bytesToIntId(bytes32 palletId) external view returns (uint256);

    /**
     * @dev Returns the uint256 id of the token id `palletId`.
     * @param palletId The bytes32 id of the pallet.
     */
    function intToBytesId(uint256 palletId) external view returns (bytes32);

    /// @dev Returns the industrial units, i.e. addresses, ids and amounts, of token `palletId`
    function getTokens(bytes32 palletId)
        external
        view
        returns (
            address[] memory,
            bytes32[] memory,
            bytes32[] memory,
            uint256[] memory
        );
}
