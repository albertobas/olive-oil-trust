import { baseContext } from 'hardhat-env/test/shared/contexts';
import { testIndependentTokenUpgradeable } from 'hardhat-env/test/tokens/IndependentTokenUpgradeable/IndependentTokenUpgradeable';
import { testDependentTokenUpgradeable } from 'hardhat-env/test/tokens/DependentTokenUpgradeable/DependentTokenUpgradeable';
import { testIndustrialUnitTokenUpgradeable } from 'hardhat-env/test/tokens/IndustrialUnitTokenUpgradeable/IndustrialUnitTokenUpgradeable';
import { testAgriculturalEscrowUpgradeable } from 'hardhat-env/test/escrows/AgriculturalEscrowUpgradeable/AgriculturalPhaseEscrowUpgradeable';
import { testCertificateUpgradeable } from 'hardhat-env/test/certificate/CertificateUpgradeable/CertificateUpgradeable';
import { testCertifierUpgradeable } from 'hardhat-env/test/roles/CertifierUpgradeable/CertifierUpgradeable';
import { testOliveGrowerUpgradeable } from 'hardhat-env/test/roles/OliveGrowerUpgradeable/OliveGrowerUpgradeable';
import { testOliveOilMillUpgradeable } from 'hardhat-env/test/roles/OliveOilMillUpgradeable/OliveOilMillUpgradeable';
import { testBottleManufacturerUpgradeable } from 'hardhat-env/test/roles/BottleManufacturerUpgradeable/BottleManufacturerUpgradeable';
import { testBottlingPlantUpgradeable } from 'hardhat-env/test/roles/BottlingPlantUpgradeable/BottlingPlantUpgradeable';
import { testDistributorUpgradeable } from 'hardhat-env/test/roles/DistributorUpgradeable/DistributorUpgradeable';
import { testRetailerUpgradeable } from 'hardhat-env/test/roles/RetailerUpgradeable/RetailerUpgradeable';
import { testIndustrialUnitsEscrowUpgradeable } from 'hardhat-env/test/escrows/IndustrialUnitsEscrowUpgradeable/IndustrialUnitsEscrowUpgradeable';
import { testCommercialUnitsEscrowUpgradeable } from 'hardhat-env/test/escrows/CommercialUnitsEscrowUpgradeable/CommercialUnitsEscrowUpgradeable';
import { testBottleCompany } from 'hardhat-env/test/members/BottleCompany/BottleCompany';
import { testBottlingCompany } from 'hardhat-env/test/members/BottlingCompany/BottlingCompany';
import { testCertifierCompany } from 'hardhat-env/test/members/CertifierCompany/CertifierCompany';
import { testDistributorCompany } from 'hardhat-env/test/members/DistributorCompany/DistributorCompany';
import { testRetailerCompany } from 'hardhat-env/test/members/RetailerCompany/RetailerCompany';
import { testOliveGrowerOne } from 'hardhat-env/test/members/OliveGrowerOne/OliveGrowerOne';
import { testOliveOilMillCompany } from 'hardhat-env/test/members/OliveOilMillCompany/OliveOilMillCompany';
import { upgrades } from 'hardhat';

baseContext('Unit tests', function () {
  upgrades.silenceWarnings();

  testIndependentTokenUpgradeable();

  testDependentTokenUpgradeable();

  testIndustrialUnitTokenUpgradeable();

  testAgriculturalEscrowUpgradeable();

  testCommercialUnitsEscrowUpgradeable();

  testIndustrialUnitsEscrowUpgradeable();

  testCertificateUpgradeable();

  testCertifierUpgradeable();

  testOliveGrowerUpgradeable();

  testOliveOilMillUpgradeable();

  testBottleManufacturerUpgradeable();

  testBottlingPlantUpgradeable();

  testDistributorUpgradeable();

  testRetailerUpgradeable();

  testBottleCompany();

  testBottlingCompany();

  testCertifierCompany();

  testDistributorCompany();

  testOliveGrowerOne();

  testOliveOilMillCompany();

  testRetailerCompany();
});
