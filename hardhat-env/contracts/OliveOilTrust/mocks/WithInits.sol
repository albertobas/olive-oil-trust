// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import '../certificate/CertificateUpgradeable.sol';
import '../escrows/AgriculturalEscrowUpgradeable.sol';
import '../escrows/CommercialUnitsEscrowUpgradeable.sol';
import '../escrows/IndustrialUnitsEscrowUpgradeable.sol';
import '../roles/BottleManufacturerUpgradeable.sol';
import '../roles/BottlingPlantUpgradeable.sol';
import '../roles/CertifierUpgradeable.sol';
import '../roles/DistributorUpgradeable.sol';
import '../roles/OliveGrowerUpgradeable.sol';
import '../roles/OliveOilMillUpgradeable.sol';
import '../roles/RetailerUpgradeable.sol';
import '../tokens/DependentTokenUpgradeable.sol';
import '../tokens/IndependentTokenUpgradeable.sol';
import '../tokens/IndustrialUnitTokenUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/// @dev BottleManufacturerUpgradeable with an initialize function
contract BottleManufacturerUpgradeableWithInit is Initializable, BottleManufacturerUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The independent token address.
     * @param escrow_ The commercial units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __BottleManufacturerUpgradeable_init('Bottle Company', token, escrow_);
    }
}

/// @dev BottlingPlantUpgradeable with an initialize function
contract BottlingPlantUpgradeableWithInit is Initializable, BottlingPlantUpgradeable {
    /**
     * @dev Initialize function.
     * @param dependentToken The dependent token address.
     * @param industrialUnitToken The industrial unit address.
     * @param escrow_ The industrial units escrow address.
     */
    function initialize(
        address dependentToken,
        address industrialUnitToken,
        address escrow_
    ) external initializer {
        __BottlingPlantUpgradeable_init('Bottling Company', dependentToken, industrialUnitToken, escrow_);
    }
}

/// @dev CertifierUpgradeable with an initialize function
contract CertifierUpgradeableWithInit is Initializable, CertifierUpgradeable {
    /**
     * @dev Initialize function.
     * @param certificate_ The certificate address.
     */
    function initialize(address certificate_) external initializer {
        __CertifierUpgradeable_init('Certifier Company', certificate_);
    }
}

/// @dev DistributorUpgradeable with an initialize function
contract DistributorUpgradeableWithInit is Initializable, DistributorUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The industrial unit address.
     * @param escrow_ The industrial units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __DistributorUpgradeable_init('Distributor Company', token, escrow_);
    }
}

/// @dev OliveGrowerUpgradeable with an initialize function
contract OliveGrowerUpgradeableWithInit is Initializable, OliveGrowerUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The independent token address.
     * @param escrow_ The agricultural units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __OliveGrowerUpgradeable_init('Olive Grower One', token, escrow_);
    }
}

/// @dev OliveOilMillUpgradeable with an initialize function
contract OliveOilMillUpgradeableWithInit is Initializable, OliveOilMillUpgradeable {
    /**
     * @dev Initialize function.
     * @param token The dependent token address.
     * @param escrow_ The commercial units escrow address.
     */
    function initialize(address token, address escrow_) external initializer {
        __OliveOilMillUpgradeable_init('Olive Oil Mill Company', token, escrow_);
    }
}

/// @dev RetailerUpgradeable with an initialize function
contract RetailerUpgradeableWithInit is Initializable, RetailerUpgradeable {
    /**
     * @dev Initialize function.
     * @param escrow_ The commercial units escrow address.
     */
    function initialize(address escrow_) external initializer {
        __RetailerUpgradeable_init('Retailer Company', escrow_);
    }
}

/// @dev CertificateUpgradeable with an initialize function
contract CertificateUpgradeableWithInit is Initializable, CertificateUpgradeable {
    /**
     * @dev Initializes the contract setting the URI `uri_`.
     * @param uri_ Base URI of the certificates.
     */
    function initialize(string memory uri_) external initializer {
        __CertificateUpgradeable_init(uri_);
    }
}

/// @dev IndependentTokenUpgradeable with an initialize function
contract IndependentTokenUpgradeableWithInit is Initializable, IndependentTokenUpgradeable {
    /**
     * @dev Initializes the contract setting the URI `uri_`.
     * @param uri_ Base URI of the tokens.
     */
    function initialize(string memory uri_) external initializer {
        __IndependentTokenUpgradeable_init(uri_);
    }
}

/// @dev DependentTokenUpgradeable with an initialize function
contract DependentTokenUpgradeableWithInit is Initializable, DependentTokenUpgradeable {
    /**
     * @dev Initializes the contract setting the URI `uri_`.
     * @param uri_ Base URI of the tokens.
     */
    function initialize(string memory uri_) external initializer {
        __DependentTokenUpgradeable_init(uri_);
    }
}

/// @dev IndustrialUnitTokenUpgradeable with an initialize function
contract IndustrialUnitTokenUpgradeableWithInit is Initializable, IndustrialUnitTokenUpgradeable {
    /**
     * @dev Initializes the contract setting the URI `uri_`.
     * @param uri_ Base URI of the tokens.
     */
    function initialize(string memory uri_) external initializer {
        __IndustrialUnitTokenUpgradeable_init(uri_);
    }
}

/// @dev IndependentTokenUpgradeable with an initialize function
contract AgriculturalEscrowUpgradeableWithInit is Initializable, AgriculturalEscrowUpgradeable {
    /// @dev Initializes the contract
    function initialize() external initializer {
        __AgriculturalEscrowUpgradeable_init();
    }
}

/// @dev CommercialUnitsEscrowUpgradeable with an initialize function
contract CommercialUnitsEscrowUpgradeableWithInit is Initializable, CommercialUnitsEscrowUpgradeable {
    /// @dev Initializes the contract
    function initialize() external initializer {
        __CommercialUnitsEscrowUpgradeable_init();
    }
}

/// @dev IndustrialUnitsEscrowUpgradeable with an initialize function
contract IndustrialUnitsEscrowUpgradeableWithInit is Initializable, IndustrialUnitsEscrowUpgradeable {
    /// @dev Initializes the contract
    function initialize() external initializer {
        __IndustrialUnitsEscrowUpgradeable_init();
    }
}
