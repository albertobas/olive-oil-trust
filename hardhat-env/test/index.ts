import { baseContext } from './shared/contexts';
import { testIndependentTokenUpgradeable } from '@test/tokens/IndependentTokenUpgradeable/IndependentTokenUpgradeable';
import { testDependentTokenUpgradeable } from '@test/tokens/DependentTokenUpgradeable/DependentTokenUpgradeable';
import { testIndustrialUnitTokenUpgradeable } from '@test/tokens/IndustrialUnitTokenUpgradeable/IndustrialUnitTokenUpgradeable';
import { testAgriculturalEscrowUpgradeable } from '@test/escrows/AgriculturalEscrowUpgradeable/AgriculturalPhaseEscrowUpgradeable';
import { testCommercialUnitsEscrowUpgradeable } from '@test/escrows/CommercialUnitsEscrowUpgradeable/CommercialUnitsEscrowUpgradeable';
import { testIndustrialUnitsEscrowUpgradeable } from '@test/escrows/IndustrialUnitsEscrowUpgradeable/IndustrialUnitsEscrowUpgradeable';
import { testCertificateUpgradeable } from '@test/certificate/CertificateUpgradeable/CertificateUpgradeable';
import { testCertifierUpgradeable } from '@test/roles/CertifierUpgradeable/CertifierUpgradeable';
import { testOliveGrowerUpgradeable } from '@test/roles/OliveGrowerUpgradeable/OliveGrowerUpgradeable';
import { testOliveOilMillUpgradeable } from '@test/roles/OliveOilMillUpgradeable/OliveOilMillUpgradeable';
import { testBottleManufacturerUpgradeable } from '@test/roles/BottleManufacturerUpgradeable/BottleManufacturerUpgradeable';
import { testBottlingPlantUpgradeable } from '@test/roles/BottlingPlantUpgradeable/BottlingPlantUpgradeable';
import { testDistributorUpgradeable } from '@test/roles/DistributorUpgradeable/DistributorUpgradeable';
import { testRetailerUpgradeable } from '@test/roles/RetailerUpgradeable/RetailerUpgradeable';
import { testBottleCompany } from '@test/members/BottleCompany/BottleCompany';
import { testBottlingCompany } from '@test/members/BottlingCompany/BottlingCompany';
import { testCertifierCompany } from '@test/members/CertifierCompany/CertifierCompany';
import { testDistributorCompany } from '@test/members/DistributorCompany/DistributorCompany';
import { testRetailerCompany } from '@test/members/RetailerCompany/RetailerCompany';
import { testOliveGrowerOne } from '@test/members/OliveGrowerOne/OliveGrowerOne';
import { testOliveOilMillCompany } from '@test/members/OliveOilMillCompany/OliveOilMillCompany';

baseContext('Unit tests', function () {
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
