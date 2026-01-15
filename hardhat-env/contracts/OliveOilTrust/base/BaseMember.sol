// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title Member base contract.
 * @dev Implementation of a base contract that implements a function to retrieve the name
 *     which is common to all members through the supply chain.
 */
abstract contract BaseMember is Initializable {
    /// @dev Name of the member
    string internal _name;

    error BaseMemberInvalidAddress();

    /**
     * @dev Event emitted when the name of a member is set.
     * @param name The name of the member.
     */
    event NameSet(string name);

    /// @dev Initializes the contract by setting a `name_`
    function __BaseMember_init(string memory name_) internal onlyInitializing {
        __BaseMember_init_unchained(name_);
    }

    function __BaseMember_init_unchained(string memory name_) internal onlyInitializing {
        _setName(name_);
    }

    /// @dev Returns the name of the member
    function name() external view returns (string memory) {
        return _name;
    }

    function _setName(string memory name_) private {
        _name = name_;
        emit NameSet(name_);
    }

    function _checkAddress(address token) internal view {
        if (token == address(0) || token.code.length == 0) revert BaseMemberInvalidAddress();
    }

    /// @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[49] private __gap;
}
