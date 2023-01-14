// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../interfaces/IDependentTokenUpgradeable.sol';
import '../libraries/Validation.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title DependentCreator base contract.
 * @dev Base contract that implements actions taken by transformers in a value chain, i.e. a member
 *     that mints dependent tokens in the supply chain. Those are members that need products from one
 *     or more suppliers in  order to produce a new product.
 */
contract DependentCreator is Initializable {
    /// @dev IDependentTokenUpgradeable reference used to interact with the token contract
    address internal _dependentToken;

    /**
     * @dev Event emitted when a token is minted. It is meant to include information about the token
     *     minted and the tokens needed to mint that dependent token, i.e, the ancestry of the token.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param inputTokenAddresses The addresses of the tokens that are consumed to mint the token.
     * @param inputTokenTypeIds The ids of the types of the tokens that are consumed to mint the token.
     * @param inputTokenIds The ids of the tokens that are consumed to mint the token.
     * @param inputTokenAmounts The ids of the tokens that are consumed to mint the token.
     */
    event TokenAncestrySet(
        address indexed tokenAddress,
        bytes32 indexed tokenTypeId,
        bytes32 indexed tokenId,
        address[][] inputTokenAddresses,
        bytes32[][] inputTokenTypeIds,
        bytes32[][] inputTokenIds,
        uint256[][] inputTokenAmounts
    );

    /// @dev Invalid Array
    error DependentCreatorInvalidArray();

    /// @dev Initializes the contract by setting the address `token_`  to the dependent token
    function __DependentCreator_init(address token_) internal onlyInitializing {
        __DependentCreator_init_unchained(token_);
    }

    function __DependentCreator_init_unchained(address token_) internal onlyInitializing {
        _dependentToken = token_;
    }

    /**
     * @dev Sets the instructions that are to be followed in order to mint a new token of type `tokenTypeId`.
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
    ) public virtual {
        IDependentTokenUpgradeable(_dependentToken).setTokenTypeInstructions(
            tokenTypeId,
            instructedTokenAddresses,
            instructedTokenTypeIds,
            instructedTokenAmounts
        );
    }

    /**
     * @dev Sets the instructions that are to be followed in order to mint new tokens of types `tokenTypeIds`.
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
    ) public virtual {
        IDependentTokenUpgradeable(_dependentToken).setTokenTypesInstructions(
            tokenTypeIds,
            instructedTokenAddresses,
            instructedTokenTypeIds,
            instructedTokenAmounts
        );
    }

    /**
     * @dev Validates the tokens used to mint the dependent token and mints `tokenAmount` units of token with id
     *     `tokenId` of type `tokenTypeId`. See {Validation-validate} and {IDependentTokenUpgradeable-mint}.
     *     Emits an event TokenAncestrySet.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The number of units to be minted.
     * @param data Struct of type Validation.MintDependentData.
     */
    function mint(
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount,
        Validation.MintDependentData calldata data
    ) public virtual {
        Validation.validate(
            tokenTypeId,
            tokenAmount,
            _dependentToken,
            Validation.MintDependentData({
                inputTokenAddresses: data.inputTokenAddresses,
                inputTokenTypeIds: data.inputTokenTypeIds,
                inputTokenIds: data.inputTokenIds,
                inputTokenAmounts: data.inputTokenAmounts
            })
        );
        IDependentTokenUpgradeable(_dependentToken).mint(address(this), tokenTypeId, tokenId, tokenAmount);
        emit TokenAncestrySet(
            address(_dependentToken),
            tokenTypeId,
            tokenId,
            data.inputTokenAddresses,
            data.inputTokenTypeIds,
            data.inputTokenIds,
            data.inputTokenAmounts
        );
    }

    /**
     * @dev Validates the tokens used to mint the dependent token and mints `tokenAmounts` units of token with ids
     *     `tokenIds` of types `tokenTypeIds`. See {Validation-validate} and {IDependentTokenUpgradeable-mintBatch}.
     *     Emits an event TokenAncestrySet for every token minted.
     *     Requirements: Every array in `data` should have the same length.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The number of units to be minted.
     * @param data Structs of type Validation.MintDependentData.
     */
    function mintBatch(
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts,
        Validation.MintDependentData[] calldata data
    ) public virtual {
        if (
            data.length != tokenTypeIds.length ||
            data.length != tokenIds.length ||
            data.length != tokenAmounts.length ||
            data.length == 0
        ) {
            revert DependentCreatorInvalidArray();
        }
        for (uint256 i = 0; i < data.length; i++) {
            Validation.validate(
                tokenTypeIds[i],
                tokenAmounts[i],
                _dependentToken,
                Validation.MintDependentData({
                    inputTokenAddresses: data[i].inputTokenAddresses,
                    inputTokenTypeIds: data[i].inputTokenTypeIds,
                    inputTokenIds: data[i].inputTokenIds,
                    inputTokenAmounts: data[i].inputTokenAmounts
                })
            );
            emit TokenAncestrySet(
                address(_dependentToken),
                tokenTypeIds[i],
                tokenIds[i],
                data[i].inputTokenAddresses,
                data[i].inputTokenTypeIds,
                data[i].inputTokenIds,
                data[i].inputTokenAmounts
            );
        }
        IDependentTokenUpgradeable(_dependentToken).mintBatch(address(this), tokenTypeIds, tokenIds, tokenAmounts);
    }
}
