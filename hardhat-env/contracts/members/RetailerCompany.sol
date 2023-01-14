// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

// import '../OliveOilTrust/interfaces/ICommercialUnitsEscrowUpgradeable.sol';
import '../OliveOilTrust/roles/RetailerUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title MemberRetailer Company contract.
 * @notice Implementation of an upgradeable contract of a member of Olive Oil Trust.
 *     This contract inherits from RetailerUpgradeable.
 */
contract RetailerCompany is Initializable, RetailerUpgradeable {
    /**
     * @dev Initialize function.
     * @param escrow_ The commercial units escrow address.
     */
    function initialize(address escrow_) external initializer {
        __RetailerUpgradeable_init('Retailer Company', escrow_);
    }
}
