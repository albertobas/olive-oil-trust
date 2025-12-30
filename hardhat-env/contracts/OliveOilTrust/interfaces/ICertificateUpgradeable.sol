// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

/// @dev Interface required for a CertificateUpgradeable contract
interface ICertificateUpgradeable {
    /**
     * @dev Event emitted when a type of token is certified.
     * @param certifierAddress The address of the certifier.
     * @param certificateId The id of the certificate.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     */
    event TokenCertified(
        address indexed certifierAddress,
        bytes32 certificateId,
        address tokenAddress,
        bytes32 tokenTypeId
    );

    /**
     * @dev Event emitted when multiple types of tokens are certified.
     * @param certifierAddress The address of the certifier.
     * @param certificateIds The ids of the certificates.
     * @param tokenAddresses The addresses of the certificates.
     * @param tokenTypeIds The ids of the types of the tokens.
     */
    event BatchCertified(
        address indexed certifierAddress,
        bytes32[] certificateIds,
        address[] tokenAddresses,
        bytes32[] tokenTypeIds
    );

    /// @dev Token is already certified
    error CertificateTokenAlreadyCertified();

    /// @dev Invalid array
    error CertificateInvalidArray();

    /// @dev Invalid address
    error CertificateInvalidAddress();

    /**
     * @dev Certifies the type of token `tokenTypeId`.
     *     Emits a TokenCertified event.
     *     Requirements:
     *     - `tokenAddress` must not be the zero address.
     *     - token with the address `tokenAddress` must not be already certified.
     * @param certificateId The id of the certificate.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     */
    function certifyToken(bytes32 certificateId, address tokenAddress, bytes32 tokenTypeId) external;

    /**
     * @dev Certifies the types of tokens `tokenTypeIds`.
     *     Emits a BatchCertified event.
     *     Requirements:
     *     - `certificateIds`, `tokenAddresses` and `tokenTypeIds` arrays must have the same length
     *       and be greater than zero
     *     - `tokenAddresses` must not contain any address that is the zero address.
     *     - `tokenAddresses` must not contain any address of a token that is already certified.
     * @param certificateIds The ids of the certificates.
     * @param tokenAddresses The addresses of the tokens.
     * @param tokenTypeIds The ids of the types of the tokens.
     */
    function certifyBatch(
        bytes32[] calldata certificateIds,
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenTypeIds
    ) external;

    /**
     * @dev Returns whether a type of token is certified or not.
     * @param certificateId The id of the certificate.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     */
    function isCertified(bytes32 certificateId, address tokenAddress, bytes32 tokenTypeId) external view returns (bool);

    /**
     * @dev Returns the certificates that a type of token `tokenTypeId` has been certified with.
     *     Requirements:
     *     - `tokenAddress` must not be the zero address.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of token.
     */
    function certificatesOf(address tokenAddress, bytes32 tokenTypeId) external view returns (bytes32[] memory);

    /**
     * @dev Returns the certificates that tokens `tokenIds` have been certified with.
     *     Requirements:
     *     - `tokenAddresses` must not contain any address that is the zero address.
     * @param tokenAddresses The addresses of the tokens.
     * @param tokenTypeIds The ids of the types of the tokens.
     */
    function certificatesOfBatch(
        address[] calldata tokenAddresses,
        bytes32[] calldata tokenTypeIds
    ) external view returns (bytes32[][] memory certificates_);

    /// @dev Returns the base URI of the certificates
    function uri() external view returns (string memory);
}
