// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../interfaces/ICertificateUpgradeable.sol';
import '../interfaces/IDependentTokenUpgradeable.sol';

library Validation {
    /// @dev Invalid Array
    error ValidationInvalidArray();

    /// @dev Invalid Input Token
    error ValidationInvalidInputToken();

    /// @dev Invalid Amount
    error ValidationInvalidAmount();

    /// @dev Struct that aims to store information about the tokens to be consumed minting a dependent token
    struct MintDependentData {
        address[][] inputTokenAddresses;
        bytes32[][] inputTokenTypeIds;
        bytes32[][] inputTokenIds;
        uint256[][] inputTokenAmounts;
    }

    /**
     * @dev Validates that the tokens used to mint a dependent token comply with the instructions set for the
     *     type `tokenTypeId` and consumes the instructed amount of every input token used in the process.
     *     Requirements:
     *     - all the arrays in `data` must have the same length in their corresponding dimensions.
     *     - `data.inputTokenAddresses` should match the instructed addresses, or if the instructions addresses
     *       a certificate, it should certify the corresponding input token address.
     *     - Amount of input units should match the instructed amount to mint the token times `tokenAmount`.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenAmount The address of the token.
     * @param tokenAddress The address of the token.
     * @param data The id of the certificate.
     */
    function validate(
        bytes32 tokenTypeId,
        uint256 tokenAmount,
        address tokenAddress,
        MintDependentData calldata data
    ) public {
        if (
            data.inputTokenAddresses.length != data.inputTokenTypeIds.length ||
            data.inputTokenAddresses.length != data.inputTokenIds.length ||
            data.inputTokenAddresses.length != data.inputTokenAmounts.length
        ) {
            revert ValidationInvalidArray();
        }
        (
            address[] memory instructedTokenAddresses,
            bytes32[] memory instructedTokenTypeIds,
            uint256[] memory instructedTokenAmounts
        ) = IDependentTokenUpgradeable(tokenAddress).getInstructions(tokenTypeId);
        for (uint256 i = 0; i < instructedTokenTypeIds.length; i++) {
            if (
                data.inputTokenAddresses[i].length != data.inputTokenTypeIds[i].length ||
                data.inputTokenAddresses[i].length != data.inputTokenIds[i].length ||
                data.inputTokenAddresses[i].length != data.inputTokenAmounts[i].length
            ) {
                revert ValidationInvalidArray();
            }
            for (uint256 j = 0; j < data.inputTokenTypeIds[i].length; j++) {
                // check that the ith jth inputed address matches the ith instructed address
                if (data.inputTokenAddresses[i][j] != instructedTokenAddresses[i]) {
                    // if not proceed as if the ith instructed address is actually the address of a certificate
                    // and that the ith input id is certified. If not, revert because the token id is neither the
                    // one in the instructions nor certified.
                    if (
                        !ICertificateUpgradeable(instructedTokenAddresses[i]).isCertified(
                            instructedTokenTypeIds[i],
                            data.inputTokenAddresses[i][j],
                            data.inputTokenTypeIds[i][j]
                        )
                    ) {
                        revert ValidationInvalidInputToken();
                    }
                }
            }
            _burn(
                data.inputTokenTypeIds[i],
                data.inputTokenIds[i],
                data.inputTokenAmounts[i],
                data.inputTokenAddresses[i],
                tokenAmount,
                instructedTokenAmounts[i]
            );
        }
    }

    function _burn(
        bytes32[] calldata inputTokenTypeIds,
        bytes32[] calldata inputTokenIds,
        uint256[] calldata inputTokenAmounts,
        address[] calldata inputTokenAddresses,
        uint256 tokenAmount,
        uint256 instructedTokenAmount
    ) private {
        uint256 inputTokenAmountNeeded = tokenAmount * instructedTokenAmount;
        uint256 accAmount;
        for (uint256 i = 0; i < inputTokenAmounts.length; i++) {
            accAmount += inputTokenAmounts[i];
            IBaseToken(inputTokenAddresses[i]).burn(
                address(this),
                inputTokenTypeIds[i],
                inputTokenIds[i],
                inputTokenAmounts[i]
            );
        }
        if (inputTokenAmountNeeded != accAmount) {
            revert ValidationInvalidAmount();
        }
    }
}
