// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../OliveOilTrust/tokens/IndependentTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/**
 * @title Bottle Company 2 bottle contract.
 * @notice Implementation of an upgradeable contract of an independent token in
 *     Olive Oil Trust. This contract inherits from IndependentTokenUpgradeable.
 */
contract BottleCompany2Bottle is Initializable, IndependentTokenUpgradeable {
    /**
     * @dev Initialize function.
     * @param uri_ Base URI of the token.
     */
    function initialize(string memory uri_) external initializer {
        __IndependentTokenUpgradeable_init(uri_);
    }
}
