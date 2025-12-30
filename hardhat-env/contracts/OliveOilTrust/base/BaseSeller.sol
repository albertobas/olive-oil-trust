// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import './BaseMember.sol';
import '../interfaces/IBaseEscrow.sol';
import '../interfaces/IBaseToken.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Seller base contract.
 * @dev Base contract that implements actions taken by a member of the supply chain which either
 *     sells commercial units or sells manufactured units
 */
abstract contract BaseSeller is Initializable, BaseMember {
    /// @dev ICommercialUnitsEscrowUpgradeable reference used to interact with the escrow contract
    address internal _escrow;

    /**
     * @dev Event emitted when the contract receive funds.
     * @param payer The address of the payer.
     * @param weiAmount The amount in wei.
     */
    event Received(address payer, uint256 weiAmount);

    /// @dev Initializes the contract by setting a `name_` and  a `escrow_`
    function __BaseSeller_init(address escrow_) internal onlyInitializing {
        __BaseSeller_init_unchained(escrow_);
    }

    function __BaseSeller_init_unchained(address escrow_) internal onlyInitializing {
        _escrow = escrow_;
    }

    /**
     * @dev Reverts the escrow `escrowId` before the deposit of ether.
     * @param escrowId The id of the escrow.
     */
    function revertBeforePayment(uint256 escrowId) public virtual {
        IBaseEscrow(_escrow).revertBeforePayment(escrowId);
    }

    /**
     * @dev Reverts the escrow `escrowId` after the deposit of ether.
     * @param escrowId The id of the escrow.
     */
    function revertAfterPayment(uint256 escrowId) public virtual {
        IBaseEscrow(_escrow).revertAfterPayment(escrowId);
    }

    /**
     * @dev Closes the escrow `escrowId`.
     * @param escrowId The id of the escrow.
     */
    function closeEscrow(uint256 escrowId) public virtual {
        IBaseEscrow(_escrow).close(escrowId);
    }

    /**
     * @dev Consumes `tokenAmount` units of token `tokenId` with address `tokenAddress`.
     * @param tokenAddress The address of the token.
     * @param tokenTypeId The id of the type of the token.
     * @param tokenId The id of the token.
     * @param tokenAmount The amount of token.
     */
    function burn(
        address tokenAddress,
        bytes32 tokenTypeId,
        bytes32 tokenId,
        uint256 tokenAmount
    ) public virtual {
        IBaseToken(tokenAddress).burn(address(this), tokenTypeId, tokenId, tokenAmount);
    }

    /**
     * @dev Consumes `tokenAmounts` units of tokens `tokenIds` with address `tokenAddress`.
     * @param tokenAddress The address of the token.
     * @param tokenTypeIds The ids of the types of the tokens.
     * @param tokenIds The ids of the tokens.
     * @param tokenAmounts The amounts of tokens.
     */
    function burnBatch(
        address tokenAddress,
        bytes32[] calldata tokenTypeIds,
        bytes32[] calldata tokenIds,
        uint256[] calldata tokenAmounts
    ) public virtual {
        IBaseToken(tokenAddress).burnBatch(address(this), tokenTypeIds, tokenIds, tokenAmounts);
    }

    /**
     * @dev Increments the balance of the contract whenever funds are received.
     *     Emits a Received event.
     */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[49] private __gap;
}
