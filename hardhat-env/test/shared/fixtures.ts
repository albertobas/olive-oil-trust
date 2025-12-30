import { Wallet, utils } from 'ethers';
import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import {
  AgriculturalEscrowUpgradeableWithInit,
  BottleManufacturerUpgradeableWithInit,
  BottlingPlantUpgradeableWithInit,
  CertificateUpgradeableWithInit,
  DependentTokenUpgradeableWithInit,
  CommercialUnitsEscrowUpgradeableWithInit,
  IndustrialUnitsEscrowUpgradeableWithInit,
  OliveGrowerUpgradeableWithInit,
  OliveOilMillUpgradeableWithInit,
  IndependentTokenUpgradeableWithInit,
  IndustrialUnitTokenUpgradeableWithInit,
  DistributorUpgradeableWithInit,
  RetailerUpgradeableWithInit,
  CertifierUpgradeableWithInit
} from '@types';
import {
  bytes32Data,
  dictBottle,
  dictOliveOil,
  dictOlives,
  dictCertificate,
  dictOliveOilBottle,
  dictPallet
} from '@test/shared/constants';
import { deploy, deployWithUpgrades } from '@shared/helpers';
import { baseUri, dictContracts } from '@shared/constants';

const idPicual = utils.formatBytes32String(dictOlives.picual.id);
const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
const idPicualToken1 = utils.formatBytes32String(dictOlives.picual.tokenId1);
const idArbequinaToken1 = utils.formatBytes32String(dictOlives.arbequina.tokenId1);
const idGlass = utils.formatBytes32String(dictBottle.glass.id1);
const idPlastic = utils.formatBytes32String(dictBottle.plastic.id1);
const idGlassToken1 = utils.formatBytes32String(dictBottle.glass.tokenId1);
const idPlasticToken1 = utils.formatBytes32String(dictBottle.plastic.tokenId1);
const idOliveOilExtraVirginIntense = utils.formatBytes32String(dictOliveOil.extraVirginIntense.id);
const idOliveOilExtraVirginSmooth = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.id);
const idOliveOilExtraVirginIntenseToken1 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId1);
const idOliveOilExtraVirginIntenseToken2 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId2);
const idOliveOilExtraVirginSmoothToken1 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId1);
const idOliveOilExtraVirginSmoothToken2 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId2);
const idDefaultPallet1 = utils.formatBytes32String(dictPallet.default.id1);
const idDefaultPallet2 = utils.formatBytes32String(dictPallet.default.id2);
const idDefaultPallet3 = utils.formatBytes32String(dictPallet.default.id3);
const idBottlingPlantPallet1 = utils.formatBytes32String(dictPallet.bottlingPlant.id1);
const idBottlingPlantPallet2 = utils.formatBytes32String(dictPallet.bottlingPlant.id2);
const idBottlingPlantPallet3 = utils.formatBytes32String(dictPallet.bottlingPlant.id3);
const idDistributorPallet1 = utils.formatBytes32String(dictPallet.distributor.id1);
const idDistributorPallet2 = utils.formatBytes32String(dictPallet.distributor.id2);
const idDistributorPallet3 = utils.formatBytes32String(dictPallet.distributor.id3);
const idCertificateOlivesHQPicual = utils.formatBytes32String(dictCertificate.olives.hQPicual);
const idCertificateOlivesMQArbequina = utils.formatBytes32String(dictCertificate.olives.mQArbequina);
const idCertificateOliveOilExtraVirginIntense = utils.formatBytes32String(dictCertificate.oliveOil.extraVirginIntense);
const idCertificateOliveOilExtraVirginSmooth = utils.formatBytes32String(dictCertificate.oliveOil.extraVirginSmooth);
const olivesUnitsToMint = dictOlives.unitsToMint;
const olivesUnitsToEscrow = dictOlives.unitsToEscrow;
const bottlesUnitsToMint = dictBottle.unitsToMint;
const bottlesUnitsToEscrow = dictBottle.unitsToEscrow;
const oliveOilBottleUnitsToEscrow = dictOliveOilBottle.unitsToEscrow;
const oliveOilBottleUnitsToMint = dictOliveOilBottle.unitsToMint;
const oliveOilBottleUnitsToPack = dictOliveOilBottle.unitsToPack;
const olivesPrice = dictOlives.price.toString();
const oliveOilPrice = dictOliveOil.price.toString();
const bottlePrice = dictBottle.price.toString();
const palletPrice = dictPallet.price.toString();
const oliveOilBottlePrice = dictOliveOilBottle.price.toString();
const oliveOilUnitsToMint = dictOliveOil.unitsToMint;
const oliveOilUnitsToEscrow = dictOliveOil.unitsToEscrow;
const extraVirginIntenseOlivesUnits = dictOliveOil.extraVirginIntense.olivesUnits;
const extraVirginSmoothOlivesUnits = dictOliveOil.extraVirginSmooth.olivesUnits;
const uri = baseUri;
const olivesOptions = { value: olivesPrice };
const oliveOilOptions = { value: oliveOilPrice };
const bottlesOptions = { value: bottlePrice };
const oliveOilBottleOptions = { value: oliveOilBottlePrice };
const palletOptions = { value: palletPrice };
const idOliveOilExtraVirginIntenseGlassBottle = utils.formatBytes32String(
  dictOliveOilBottle.extraVirginIntenseGlass.id
);
const idOliveOilExtraVirginSmoothPlasticBottle = utils.formatBytes32String(
  dictOliveOilBottle.extraVirginSmoothPlastic.id
);
const idOliveOilExtraVirginIntenseGlassBottleToken1 = utils.formatBytes32String(
  dictOliveOilBottle.extraVirginIntenseGlass.tokenId1
);
const idOliveOilExtraVirginSmoothPlasticBottleToken1 = utils.formatBytes32String(
  dictOliveOilBottle.extraVirginSmoothPlastic.tokenId1
);
const extraVirginIntenseGlassBottleOliveOilUnits = dictOliveOilBottle.extraVirginIntenseGlass.oliveOilUnits;
const extraVirginSmoothPlasticBottleOliveOilUnits = dictOliveOilBottle.extraVirginSmoothPlastic.oliveOilUnits;
const extraVirginIntenseGlassBottleBottlesUnits = dictOliveOilBottle.extraVirginSmoothPlastic.bottleUnits;
const extraVirginSmoothPlasticBottleBottlesUnits = dictOliveOilBottle.extraVirginSmoothPlastic.bottleUnits;
const uupsProxyOpts: DeployProxyOptions = {
  kind: 'uups'
};

/**
 * IndependentTokenUpgradeable
 */
async function deployIndependentToken(signer: Wallet): Promise<IndependentTokenUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.independentTokenWithInit.v1,
    signer,
    args: [uri]
  });
  return proxy as IndependentTokenUpgradeableWithInit;
}

export async function olivesTokenFixture(signers: Wallet[]): Promise<IndependentTokenUpgradeableWithInit> {
  const token = await deployIndependentToken(signers[0]);
  return token;
}

export async function mintedOlivesFixture(signers: Wallet[]): Promise<IndependentTokenUpgradeableWithInit> {
  const token = await deployIndependentToken(signers[0]);
  const deployer = signers[0];
  await token.mintBatch(
    deployer.address,
    [idPicual, idArbequina],
    [idPicualToken1, idArbequinaToken1],
    [olivesUnitsToMint, olivesUnitsToMint]
  );
  return token;
}

export async function mintedBottleFixture(signers: Wallet[]): Promise<IndependentTokenUpgradeableWithInit> {
  const token = await deployIndependentToken(signers[0]);
  const deployer = signers[0];
  await token.mintBatch(
    deployer.address,
    [idGlass, idPlastic],
    [idGlassToken1, idPlasticToken1],
    [bottlesUnitsToMint, bottlesUnitsToMint]
  );
  return token;
}

/**
 * DependentTokenUpgradeable
 */
async function deployDependentToken(signer: Wallet): Promise<DependentTokenUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.dependentTokenWithInit.v1,
    signer,
    args: [uri]
  });
  return proxy as DependentTokenUpgradeableWithInit;
}

export async function oliveOilTokenFixture(
  signers: Wallet[]
): Promise<{ olivesToken: IndependentTokenUpgradeableWithInit; oliveOilToken: DependentTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const olivesToken = await mintedOlivesFixture(signers);
  const oliveOilToken = await deployDependentToken(deployer);
  return { olivesToken, oliveOilToken };
}

export async function mintedOliveOilTokenFixture(
  signers: Wallet[]
): Promise<{ olivesToken: IndependentTokenUpgradeableWithInit; oliveOilToken: DependentTokenUpgradeableWithInit }> {
  const { olivesToken, oliveOilToken } = await oliveOilTokenFixture(signers);
  const deployer = signers[0];
  await oliveOilToken.setTokenTypeInstructions(
    idOliveOilExtraVirginIntense,
    [olivesToken.address],
    [idPicual],
    [extraVirginIntenseOlivesUnits]
  );
  await oliveOilToken.setTokenTypeInstructions(
    idOliveOilExtraVirginSmooth,
    [olivesToken.address],
    [idArbequina],
    [extraVirginSmoothOlivesUnits]
  );
  await oliveOilToken.mintBatch(
    deployer.address,
    [idOliveOilExtraVirginIntense, idOliveOilExtraVirginIntense],
    [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginIntenseToken2],
    [oliveOilUnitsToMint, oliveOilUnitsToMint]
  );
  await oliveOilToken.mintBatch(
    deployer.address,
    [idOliveOilExtraVirginSmooth, idOliveOilExtraVirginSmooth],
    [idOliveOilExtraVirginSmoothToken1, idOliveOilExtraVirginSmoothToken2],
    [oliveOilUnitsToMint, oliveOilUnitsToMint]
  );
  return { olivesToken, oliveOilToken };
}

/**
 * PalletToken
 */
async function deployIndustrialUnitToken(signer: Wallet): Promise<IndustrialUnitTokenUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.industrialUnitTokenWithInit.v1,
    signer,
    args: [uri]
  });
  return proxy as IndustrialUnitTokenUpgradeableWithInit;
}

export async function palletTokenFixture(signers: Wallet[]): Promise<{
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const bottleToken = await mintedBottleFixture(signers);
  const { oliveOilToken } = await mintedOliveOilTokenFixture(signers);
  const palletToken = await deployIndustrialUnitToken(deployer);
  const oliveOilBottleToken = await deployDependentToken(deployer);
  await oliveOilBottleToken.setTokenTypesInstructions(
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [
      [oliveOilToken.address, bottleToken.address],
      [oliveOilToken.address, bottleToken.address]
    ],
    [
      [idOliveOilExtraVirginIntense, idGlass],
      [idOliveOilExtraVirginSmooth, idPlastic]
    ],
    [
      [extraVirginIntenseGlassBottleOliveOilUnits, extraVirginIntenseGlassBottleBottlesUnits],
      [extraVirginSmoothPlasticBottleOliveOilUnits, extraVirginSmoothPlasticBottleBottlesUnits]
    ]
  );
  await oliveOilBottleToken.mintBatch(
    deployer.address,
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [oliveOilBottleUnitsToMint, oliveOilBottleUnitsToMint]
  );
  return { palletToken, oliveOilBottleToken };
}

export async function packedPalletFixture(signers: Wallet[]): Promise<{
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { palletToken, oliveOilBottleToken } = await palletTokenFixture(signers);
  const tokenAddresses = [
    [oliveOilBottleToken.address, oliveOilBottleToken.address],
    [oliveOilBottleToken.address, oliveOilBottleToken.address],
    [oliveOilBottleToken.address]
  ];
  const tokenTypeIds = [
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottle]
  ];
  const tokenIds = [
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [idOliveOilExtraVirginIntenseGlassBottleToken1]
  ];
  const tokenAmounts = [
    [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
    [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
    [oliveOilBottleUnitsToPack]
  ];
  await oliveOilBottleToken.setApprovalForAll(palletToken.address, true);
  await palletToken.packBatch(
    deployer.address,
    [idDefaultPallet1, idDefaultPallet2, idDefaultPallet3],
    tokenAddresses,
    tokenTypeIds,
    tokenIds,
    tokenAmounts
  );
  return { palletToken, oliveOilBottleToken };
}

/**
 * Escrow
 */
async function deployAgriculturalEscrow(signer: Wallet): Promise<AgriculturalEscrowUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.agriculturalEscrowWithInit.v1,
    signer
  });
  return proxy as AgriculturalEscrowUpgradeableWithInit;
}

async function deployCommercialUnitsEscrow(signer: Wallet): Promise<CommercialUnitsEscrowUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.commercialUnitsEscrowWithInit.v1,
    signer
  });
  return proxy as CommercialUnitsEscrowUpgradeableWithInit;
}

async function deployIndustrialUnitsEscrow(signer: Wallet): Promise<IndustrialUnitsEscrowUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.industrialUnitsEscrowWithInit.v1,
    signer
  });
  return proxy as IndustrialUnitsEscrowUpgradeableWithInit;
}

export async function olivesEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: AgriculturalEscrowUpgradeableWithInit; olivesToken: IndependentTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const escrow = await deployAgriculturalEscrow(deployer);
  const olivesToken = await mintedOlivesFixture(signers);
  return { escrow, olivesToken };
}

export async function activeOlivesEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: AgriculturalEscrowUpgradeableWithInit; olivesToken: IndependentTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const { escrow, olivesToken } = await olivesEscrowFixture(signers);
  const tokenTypeIds = [idPicual, idArbequina];
  const tokenIds = [idPicualToken1, idArbequinaToken1];
  await olivesToken.setApprovalForAll(escrow.address, true);
  await escrow.depositToken(olivesToken.address, tokenTypeIds[0], tokenIds[0], olivesUnitsToEscrow, deployer.address);
  await escrow.depositBatch(
    olivesToken.address,
    tokenTypeIds,
    tokenIds,
    [olivesUnitsToEscrow, olivesUnitsToEscrow],
    deployer.address
  );
  return { escrow, olivesToken };
}

export async function depositedOlivesEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: AgriculturalEscrowUpgradeableWithInit; olivesToken: IndependentTokenUpgradeableWithInit }> {
  const acc2 = signers[1];
  const acc3 = signers[2];
  const { escrow, olivesToken } = await activeOlivesEscrowFixture(signers);
  await escrow.connect(acc2).makeOffer(0, acc3.address, olivesOptions);
  await escrow.connect(acc2).makeOffer(1, acc3.address, olivesOptions);
  return { escrow, olivesToken };
}

export async function oliveOilEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: CommercialUnitsEscrowUpgradeableWithInit; oliveOilToken: DependentTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const escrow = await deployCommercialUnitsEscrow(deployer);
  const { oliveOilToken } = await mintedOliveOilTokenFixture(signers);
  return { escrow, oliveOilToken };
}

export async function activeOliveOilEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: CommercialUnitsEscrowUpgradeableWithInit; oliveOilToken: DependentTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const { escrow, oliveOilToken } = await oliveOilEscrowFixture(signers);
  const tokenTypeIds = [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth];
  const tokenIds = [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1];
  await oliveOilToken.setApprovalForAll(escrow.address, true);
  await escrow.depositToken(
    oliveOilToken.address,
    tokenTypeIds[0],
    tokenIds[0],
    oliveOilUnitsToEscrow,
    oliveOilPrice,
    deployer.address
  );
  await escrow.depositBatch(
    oliveOilToken.address,
    tokenTypeIds,
    tokenIds,
    [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow],
    oliveOilPrice,
    deployer.address
  );
  return { escrow, oliveOilToken };
}

export async function depositedOliveOilEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: CommercialUnitsEscrowUpgradeableWithInit; oliveOilToken: DependentTokenUpgradeableWithInit }> {
  const acc2 = signers[1];
  const acc3 = signers[2];
  const { escrow, oliveOilToken } = await activeOliveOilEscrowFixture(signers);
  await escrow.connect(acc2).makePayment(0, acc3.address, oliveOilOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, oliveOilOptions);
  return { escrow, oliveOilToken };
}

export async function palletEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: IndustrialUnitsEscrowUpgradeableWithInit; palletToken: IndustrialUnitTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const escrow = await deployIndustrialUnitsEscrow(deployer);
  const { palletToken } = await packedPalletFixture(signers);
  return { escrow, palletToken };
}

export async function activePalletEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: IndustrialUnitsEscrowUpgradeableWithInit; palletToken: IndustrialUnitTokenUpgradeableWithInit }> {
  const deployer = signers[0];
  const { escrow, palletToken } = await palletEscrowFixture(signers);
  await palletToken.setApprovalForAll(escrow.address, true);
  await escrow.depositToken(palletToken.address, idDefaultPallet1, palletPrice, deployer.address);
  await escrow.depositBatch(palletToken.address, [idDefaultPallet2, idDefaultPallet3], palletPrice, deployer.address);
  return { escrow, palletToken };
}

export async function depositedPalletEscrowFixture(
  signers: Wallet[]
): Promise<{ escrow: IndustrialUnitsEscrowUpgradeableWithInit; palletToken: IndustrialUnitTokenUpgradeableWithInit }> {
  const acc2 = signers[1];
  const acc3 = signers[2];
  const { escrow, palletToken } = await activePalletEscrowFixture(signers);
  await escrow.connect(acc2).makePayment(0, acc3.address, palletOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, palletOptions);
  return { escrow, palletToken };
}

/**
 * Certificate
 */
async function deployCertificate(signer: Wallet): Promise<CertificateUpgradeableWithInit> {
  const { proxy } = await deployWithUpgrades({
    name: dictContracts.certificateWithInit.v1,
    signer,
    args: [uri],
    opts: uupsProxyOpts
  });
  return proxy as CertificateUpgradeableWithInit;
}

export async function certificateFixture(signers: Wallet[]): Promise<CertificateUpgradeableWithInit> {
  const acc2 = signers[1];
  const certificate = await deployCertificate(acc2);
  return certificate;
}

export async function olivesCertificateFixture(
  signers: Wallet[]
): Promise<{ certificate: CertificateUpgradeableWithInit; olivesToken: IndependentTokenUpgradeableWithInit }> {
  const acc2 = signers[1];
  const olivesToken = await mintedOlivesFixture(signers);
  const certificate = await deployCertificate(acc2);
  return { certificate, olivesToken };
}

export async function certifiedPicualCertificateFixture(
  signers: Wallet[]
): Promise<{ certificate: CertificateUpgradeableWithInit; olivesToken: IndependentTokenUpgradeableWithInit }> {
  const acc2 = signers[1];
  const { certificate, olivesToken } = await olivesCertificateFixture(signers);
  await certificate.connect(acc2).certifyToken(idCertificateOlivesHQPicual, olivesToken.address, idPicual);
  return { certificate, olivesToken };
}

/**
 * Certifier
 */
export async function certifierFixture(signers: Wallet[]): Promise<{
  certifier: CertifierUpgradeableWithInit;
  certificate: CertificateUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const acc2 = signers[1];
  const { certificate, olivesToken } = await olivesCertificateFixture(signers);
  const certifier = (await deploy('CertifierUpgradeableWithInit', deployer)) as CertifierUpgradeableWithInit;
  await certifier.initialize(certificate.address);
  await certificate.connect(acc2).transferOwnership(certifier.address);
  return { certifier, certificate, olivesToken };
}

export async function certifiedPicualCertifierFixture(signers: Wallet[]): Promise<{
  certifier: CertifierUpgradeableWithInit;
  certificate: CertificateUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
}> {
  const { certifier, certificate, olivesToken } = await certifierFixture(signers);
  await certifier.certifyToken(idCertificateOlivesHQPicual, olivesToken.address, idPicual);
  return { certifier, certificate, olivesToken };
}

/**
 * Olive Grower
 */
export async function oliveGrowerFixture(signers: Wallet[]): Promise<{
  oliveGrower: OliveGrowerUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  escrow: AgriculturalEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const olivesToken = await deployIndependentToken(signers[0]);
  const escrow = await deployAgriculturalEscrow(deployer);
  const oliveGrower = (await deploy(dictContracts.oliveGrowerWithInit.v1, deployer)) as OliveGrowerUpgradeableWithInit;
  await oliveGrower.initialize(olivesToken.address, escrow.address);
  await olivesToken.transferOwnership(oliveGrower.address);
  await escrow.transferOwnership(oliveGrower.address);
  return { oliveGrower, olivesToken, escrow };
}

export async function mintedOliveGrowerFixture(signers: Wallet[]): Promise<{
  oliveGrower: OliveGrowerUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  escrow: AgriculturalEscrowUpgradeableWithInit;
}> {
  const { oliveGrower, olivesToken, escrow } = await oliveGrowerFixture(signers);
  await oliveGrower.mintBatch(
    [idPicual, idArbequina],
    [idPicualToken1, idArbequinaToken1],
    [olivesUnitsToMint, olivesUnitsToMint]
  );
  return { oliveGrower, olivesToken, escrow };
}

export async function activeOliveGrowerFixture(signers: Wallet[]): Promise<{
  oliveGrower: OliveGrowerUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  escrow: AgriculturalEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { oliveGrower, olivesToken, escrow } = await mintedOliveGrowerFixture(signers);
  await oliveGrower.depositToken(idPicual, idPicualToken1, olivesUnitsToEscrow, oliveGrower.address);
  await oliveGrower.depositBatch(
    [idPicual, idArbequina],
    [idPicualToken1, idArbequinaToken1],
    [olivesUnitsToEscrow, olivesUnitsToEscrow],
    deployer.address
  );
  return { oliveGrower, olivesToken, escrow };
}

export async function offeredOliveGrowerFixture(signers: Wallet[]): Promise<{
  oliveGrower: OliveGrowerUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  escrow: AgriculturalEscrowUpgradeableWithInit;
}> {
  const acc2 = signers[1];
  const { oliveGrower, olivesToken, escrow } = await activeOliveGrowerFixture(signers);
  await escrow.connect(acc2).makeOffer(0, acc2.address, olivesOptions);
  await escrow.connect(acc2).makeOffer(1, acc2.address, olivesOptions);
  return { oliveGrower, olivesToken, escrow };
}

/**
 * Bottle Manufacturer
 */
export async function bottleManufacturerFixture(signers: Wallet[]): Promise<{
  bottleManufacturer: BottleManufacturerUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const bottleToken = await deployIndependentToken(signers[0]);
  const escrow = await deployCommercialUnitsEscrow(deployer);
  const bottleManufacturer = (await deploy(
    dictContracts.bottleManufacturerWithInit.v1,
    deployer
  )) as BottleManufacturerUpgradeableWithInit;
  return { bottleManufacturer, bottleToken, escrow };
}

export async function initializedBottleManufacturerFixture(signers: Wallet[]): Promise<{
  bottleManufacturer: BottleManufacturerUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottleToken, bottleManufacturer, escrow } = await bottleManufacturerFixture(signers);
  await bottleManufacturer.initialize(bottleToken.address, escrow.address);
  await bottleToken.transferOwnership(bottleManufacturer.address);
  await escrow.transferOwnership(bottleManufacturer.address);
  return { bottleManufacturer, bottleToken, escrow };
}

export async function mintedBottleManufacturerFixture(signers: Wallet[]): Promise<{
  bottleManufacturer: BottleManufacturerUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottleManufacturer, bottleToken, escrow } = await initializedBottleManufacturerFixture(signers);
  await bottleManufacturer.mintBatch(
    [idGlass, idPlastic],
    [idGlassToken1, idPlasticToken1],
    [bottlesUnitsToMint, bottlesUnitsToMint]
  );
  return { bottleManufacturer, bottleToken, escrow };
}

export async function activeBottleManufacturerFixture(signers: Wallet[]): Promise<{
  bottleManufacturer: BottleManufacturerUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { bottleManufacturer, bottleToken, escrow } = await mintedBottleManufacturerFixture(signers);
  await bottleManufacturer.depositToken(
    idGlass,
    idGlassToken1,
    bottlesUnitsToEscrow,
    bottlePrice,
    bottleManufacturer.address
  );
  await bottleManufacturer.depositBatch(
    [idGlass, idPlastic],
    [idGlassToken1, idPlasticToken1],
    [bottlesUnitsToEscrow, bottlesUnitsToEscrow],
    bottlePrice,
    deployer.address
  );
  return { bottleManufacturer, bottleToken, escrow };
}

export async function depositedBottleManufacturerFixture(signers: Wallet[]): Promise<{
  bottleManufacturer: BottleManufacturerUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const acc2 = signers[1];
  const acc3 = signers[2];
  const { bottleManufacturer, bottleToken, escrow } = await activeBottleManufacturerFixture(signers);
  await escrow.connect(acc2).makePayment(0, acc3.address, bottlesOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, bottlesOptions);
  return { bottleManufacturer, bottleToken, escrow };
}

/**
 * Olive Oil Mill
 */
export async function oliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const olivesToken = await mintedOlivesFixture(signers);
  const oliveOilToken = await deployDependentToken(deployer);
  const escrow = await deployCommercialUnitsEscrow(deployer);
  const oliveOilMill = (await deploy(dictContracts.oliveOilMillWithInit.v1, deployer, undefined, [
    dictContracts.validation.v1
  ])) as OliveOilMillUpgradeableWithInit;
  return { oliveOilMill, olivesToken, oliveOilToken, escrow };
}

export async function initializedOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { oliveOilMill, olivesToken, oliveOilToken, escrow } = await oliveOilMillFixture(signers);
  await oliveOilMill.initialize(oliveOilToken.address, escrow.address);
  await oliveOilToken.transferOwnership(oliveOilMill.address);
  await escrow.transferOwnership(oliveOilMill.address);
  return { oliveOilMill, olivesToken, oliveOilToken, escrow };
}

async function instructedOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { oliveOilMill, olivesToken, oliveOilToken, escrow } = await initializedOliveOilMillFixture(signers);
  const idIntPicualToken1 = await olivesToken.bytesToIntTokenId(idPicual, idPicualToken1);
  const idIntArbequinaToken1 = await olivesToken.bytesToIntTokenId(idArbequina, idArbequinaToken1);
  await olivesToken.safeBatchTransferFrom(
    deployer.address,
    oliveOilMill.address,
    [idIntPicualToken1, idIntArbequinaToken1],
    [olivesUnitsToMint, olivesUnitsToMint],
    bytes32Data
  );
  await oliveOilMill.setTokenTypesInstructions(
    [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
    [[olivesToken.address], [olivesToken.address]],
    [[idPicual], [idArbequina]],
    [[extraVirginIntenseOlivesUnits], [extraVirginSmoothOlivesUnits]]
  );
  return { oliveOilMill, olivesToken, oliveOilToken, escrow };
}

export async function instructedCertificateOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: {
    oliveOilMill: OliveOilMillUpgradeableWithInit;
    olivesToken: IndependentTokenUpgradeableWithInit;
    oliveOilToken: DependentTokenUpgradeableWithInit;
    escrow: CommercialUnitsEscrowUpgradeableWithInit;
  };
  oliveOilMillWithCertificate: {
    oliveOilMill: OliveOilMillUpgradeableWithInit;
    olivesToken: IndependentTokenUpgradeableWithInit;
    oliveOilToken: DependentTokenUpgradeableWithInit;
    escrow: CommercialUnitsEscrowUpgradeableWithInit;
  };
}> {
  const deployer = signers[0];
  const acc2 = signers[1];
  const oliveOilMill = await instructedOliveOilMillFixture(signers);
  const oliveOilMillWithCertificate = await initializedOliveOilMillFixture(signers);
  const certificate = await deployCertificate(acc2);
  await certificate
    .connect(acc2)
    .certifyToken(idCertificateOlivesHQPicual, oliveOilMillWithCertificate.olivesToken.address, idPicual);
  await certificate
    .connect(acc2)
    .certifyToken(idCertificateOlivesMQArbequina, oliveOilMillWithCertificate.olivesToken.address, idArbequina);
  const idIntPicualToken1 = await oliveOilMillWithCertificate.olivesToken.bytesToIntTokenId(idPicual, idPicualToken1);
  const idIntArbequinaToken1 = await oliveOilMillWithCertificate.olivesToken.bytesToIntTokenId(
    idArbequina,
    idArbequinaToken1
  );
  await oliveOilMillWithCertificate.olivesToken.safeBatchTransferFrom(
    deployer.address,
    oliveOilMillWithCertificate.oliveOilMill.address,
    [idIntPicualToken1, idIntArbequinaToken1],
    [olivesUnitsToMint, olivesUnitsToMint],
    bytes32Data
  );
  await oliveOilMillWithCertificate.oliveOilMill.setTokenTypesInstructions(
    [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
    [[certificate.address], [certificate.address]],
    [[idCertificateOlivesHQPicual], [idCertificateOlivesMQArbequina]],
    [[extraVirginIntenseOlivesUnits], [extraVirginSmoothOlivesUnits]]
  );
  return { oliveOilMill, oliveOilMillWithCertificate };
}

export async function mintedOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { oliveOilMill, olivesToken, oliveOilToken, escrow } = await instructedOliveOilMillFixture(signers);
  await oliveOilMill.mintBatch(
    [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
    [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
    [oliveOilUnitsToMint, oliveOilUnitsToMint],
    [
      {
        inputTokenAddresses: [[olivesToken.address]],
        inputTokenTypeIds: [[idPicual]],
        inputTokenIds: [[idPicualToken1]],
        inputTokenAmounts: [[oliveOilUnitsToMint * extraVirginIntenseOlivesUnits]]
      },
      {
        inputTokenAddresses: [[olivesToken.address]],
        inputTokenTypeIds: [[idArbequina]],
        inputTokenIds: [[idArbequinaToken1]],
        inputTokenAmounts: [[oliveOilUnitsToMint * extraVirginSmoothOlivesUnits]]
      }
    ]
  );
  return { oliveOilMill, olivesToken, oliveOilToken, escrow };
}

export async function activeOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { oliveOilMill, olivesToken, oliveOilToken, escrow } = await mintedOliveOilMillFixture(signers);
  const deployer = signers[0];
  await oliveOilMill.depositToken(
    idOliveOilExtraVirginIntense,
    idOliveOilExtraVirginIntenseToken1,
    oliveOilUnitsToEscrow,
    oliveOilPrice,
    oliveOilMill.address
  );

  await oliveOilMill.depositBatch(
    [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
    [idOliveOilExtraVirginIntenseToken1, idOliveOilExtraVirginSmoothToken1],
    [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow],
    oliveOilPrice,
    deployer.address
  );
  return { oliveOilMill, olivesToken, oliveOilToken, escrow };
}

export async function depositedOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { oliveOilMill, olivesToken, oliveOilToken, escrow } = await activeOliveOilMillFixture(signers);
  const acc2 = signers[1];
  const acc3 = signers[2];
  await escrow.connect(acc2).makePayment(0, acc3.address, oliveOilOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, oliveOilOptions);
  return { oliveOilMill, olivesToken, oliveOilToken, escrow };
}

export async function paymentOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  escrow: AgriculturalEscrowUpgradeableWithInit;
}> {
  const { oliveOilMill } = await initializedOliveOilMillFixture(signers);
  const { escrow, olivesToken } = await activeOlivesEscrowFixture(signers);
  return { oliveOilMill, olivesToken, escrow };
}

export async function offeredPaymentOliveOilMillFixture(signers: Wallet[]): Promise<{
  oliveOilMill: OliveOilMillUpgradeableWithInit;
  olivesToken: IndependentTokenUpgradeableWithInit;
  escrow: AgriculturalEscrowUpgradeableWithInit;
}> {
  const { oliveOilMill, escrow, olivesToken } = await paymentOliveOilMillFixture(signers);
  await oliveOilMill.makeOffer(escrow.address, 0, oliveOilMill.address, olivesOptions);
  return { oliveOilMill, olivesToken, escrow };
}

/**
 * BottlingPlant
 */
export async function bottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const bottleToken = await mintedBottleFixture(signers);
  const { oliveOilToken } = await mintedOliveOilTokenFixture(signers);
  const oliveOilBottleToken = await deployDependentToken(deployer);
  const palletToken = await deployIndustrialUnitToken(deployer);
  const escrow = await deployIndustrialUnitsEscrow(deployer);
  const bottlingPlant = (await deploy(dictContracts.bottlingPlantWithInit.v1, deployer, undefined, [
    dictContracts.validation.v1
  ])) as BottlingPlantUpgradeableWithInit;
  return { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow };
}

export async function initializedBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow } =
    await bottlingPlantFixture(signers);
  await bottlingPlant.initialize(oliveOilBottleToken.address, palletToken.address, escrow.address);
  await oliveOilBottleToken.transferOwnership(bottlingPlant.address);
  await palletToken.transferOwnership(bottlingPlant.address);
  await escrow.transferOwnership(bottlingPlant.address);
  return { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow };
}

async function instructedBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow } =
    await initializedBottlingPlantFixture(signers);
  const idIntOliveOilExtraVirginIntenseToken1 = await oliveOilToken.bytesToIntTokenId(
    idOliveOilExtraVirginIntense,
    idOliveOilExtraVirginIntenseToken1
  );
  const idIntOliveOilExtraVirginSmoothToken1 = await oliveOilToken.bytesToIntTokenId(
    idOliveOilExtraVirginSmooth,
    idOliveOilExtraVirginSmoothToken1
  );
  const idIntGlassToken1 = await bottleToken.bytesToIntTokenId(idGlass, idGlassToken1);
  const idIntPlasticToken1 = await bottleToken.bytesToIntTokenId(idPlastic, idPlasticToken1);
  await oliveOilToken.safeBatchTransferFrom(
    deployer.address,
    bottlingPlant.address,
    [idIntOliveOilExtraVirginIntenseToken1, idIntOliveOilExtraVirginSmoothToken1],
    [oliveOilUnitsToMint, oliveOilUnitsToMint],
    bytes32Data
  );
  await bottleToken.safeBatchTransferFrom(
    deployer.address,
    bottlingPlant.address,
    [idIntGlassToken1, idIntPlasticToken1],
    [bottlesUnitsToMint, bottlesUnitsToMint],
    bytes32Data
  );
  await bottlingPlant.setTokenTypesInstructions(
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [
      [oliveOilToken.address, bottleToken.address],
      [oliveOilToken.address, bottleToken.address]
    ],
    [
      [idOliveOilExtraVirginIntense, idGlass],
      [idOliveOilExtraVirginSmooth, idPlastic]
    ],
    [
      [extraVirginIntenseGlassBottleOliveOilUnits, extraVirginIntenseGlassBottleBottlesUnits],
      [extraVirginSmoothPlasticBottleOliveOilUnits, extraVirginSmoothPlasticBottleBottlesUnits]
    ]
  );
  return { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow };
}

export async function instructedCertificateBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: {
    bottlingPlant: BottlingPlantUpgradeableWithInit;
    bottleToken: IndependentTokenUpgradeableWithInit;
    oliveOilToken: DependentTokenUpgradeableWithInit;
    palletToken: IndustrialUnitTokenUpgradeableWithInit;
    oliveOilBottleToken: DependentTokenUpgradeableWithInit;
    escrow: IndustrialUnitsEscrowUpgradeableWithInit;
  };
  bottlingPlantWithCertificate: {
    bottlingPlant: BottlingPlantUpgradeableWithInit;
    bottleToken: IndependentTokenUpgradeableWithInit;
    oliveOilToken: DependentTokenUpgradeableWithInit;
    palletToken: IndustrialUnitTokenUpgradeableWithInit;
    oliveOilBottleToken: DependentTokenUpgradeableWithInit;
    escrow: IndustrialUnitsEscrowUpgradeableWithInit;
  };
}> {
  const deployer = signers[0];
  const acc2 = signers[1];
  const bottlingPlant = await instructedBottlingPlantFixture(signers);
  const bottlingPlantWithCertificate = await initializedBottlingPlantFixture(signers);
  const certificate = await deployCertificate(acc2);
  await certificate
    .connect(acc2)
    .certifyToken(
      idCertificateOliveOilExtraVirginIntense,
      bottlingPlantWithCertificate.oliveOilToken.address,
      idOliveOilExtraVirginIntense
    );
  await certificate
    .connect(acc2)
    .certifyToken(
      idCertificateOliveOilExtraVirginSmooth,
      bottlingPlantWithCertificate.oliveOilToken.address,
      idOliveOilExtraVirginSmooth
    );
  const idIntOliveOilExtraVirginIntenseToken1 = await bottlingPlantWithCertificate.oliveOilToken.bytesToIntTokenId(
    idOliveOilExtraVirginIntense,
    idOliveOilExtraVirginIntenseToken1
  );
  const idIntOliveOilExtraVirginSmoothToken1 = await bottlingPlantWithCertificate.oliveOilToken.bytesToIntTokenId(
    idOliveOilExtraVirginSmooth,
    idOliveOilExtraVirginSmoothToken1
  );
  const idIntGlassToken1 = await bottlingPlantWithCertificate.bottleToken.bytesToIntTokenId(idGlass, idGlassToken1);
  const idIntPlasticToken1 = await bottlingPlantWithCertificate.bottleToken.bytesToIntTokenId(
    idPlastic,
    idPlasticToken1
  );
  await bottlingPlantWithCertificate.oliveOilToken.safeBatchTransferFrom(
    deployer.address,
    bottlingPlantWithCertificate.bottlingPlant.address,
    [idIntOliveOilExtraVirginIntenseToken1, idIntOliveOilExtraVirginSmoothToken1],
    [oliveOilUnitsToMint, oliveOilUnitsToMint],
    bytes32Data
  );
  await bottlingPlantWithCertificate.bottleToken.safeBatchTransferFrom(
    deployer.address,
    bottlingPlantWithCertificate.bottlingPlant.address,
    [idIntGlassToken1, idIntPlasticToken1],
    [bottlesUnitsToMint, bottlesUnitsToMint],
    bytes32Data
  );
  await bottlingPlantWithCertificate.bottlingPlant.setTokenTypesInstructions(
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [
      [certificate.address, bottlingPlantWithCertificate.bottleToken.address],
      [certificate.address, bottlingPlantWithCertificate.bottleToken.address]
    ],
    [
      [idCertificateOliveOilExtraVirginIntense, idGlass],
      [idCertificateOliveOilExtraVirginSmooth, idPlastic]
    ],
    [
      [extraVirginIntenseGlassBottleOliveOilUnits, extraVirginIntenseGlassBottleBottlesUnits],
      [extraVirginSmoothPlasticBottleOliveOilUnits, extraVirginSmoothPlasticBottleBottlesUnits]
    ]
  );
  return { bottlingPlant, bottlingPlantWithCertificate };
}

export async function mintedBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  bottleToken: IndependentTokenUpgradeableWithInit;
  oliveOilToken: DependentTokenUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow } =
    await instructedBottlingPlantFixture(signers);
  await bottlingPlant.mintBatch(
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [oliveOilBottleUnitsToMint, oliveOilBottleUnitsToMint],
    [
      {
        inputTokenAddresses: [[oliveOilToken.address], [bottleToken.address]],
        inputTokenTypeIds: [[idOliveOilExtraVirginIntense], [idGlass]],
        inputTokenIds: [[idOliveOilExtraVirginIntenseToken1], [idGlassToken1]],
        inputTokenAmounts: [
          [oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleOliveOilUnits],
          [oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleBottlesUnits]
        ]
      },
      {
        inputTokenAddresses: [[oliveOilToken.address], [bottleToken.address]],
        inputTokenTypeIds: [[idOliveOilExtraVirginSmooth], [idPlastic]],
        inputTokenIds: [[idOliveOilExtraVirginSmoothToken1], [idPlasticToken1]],
        inputTokenAmounts: [
          [oliveOilBottleUnitsToMint * extraVirginSmoothPlasticBottleOliveOilUnits],
          [oliveOilBottleUnitsToMint * extraVirginSmoothPlasticBottleBottlesUnits]
        ]
      }
    ]
  );
  return { bottlingPlant, bottleToken, oliveOilToken, oliveOilBottleToken, palletToken, escrow };
}

export async function packedBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant, oliveOilBottleToken, palletToken, escrow } = await mintedBottlingPlantFixture(signers);
  const tokenTypeIds = [
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottle]
  ];
  const tokenIds = [
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [idOliveOilExtraVirginIntenseGlassBottleToken1]
  ];
  const tokenAmounts = [
    [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
    [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
    [oliveOilBottleUnitsToPack]
  ];
  await bottlingPlant.packBatch(
    [idBottlingPlantPallet1, idBottlingPlantPallet2, idBottlingPlantPallet3],
    tokenTypeIds,
    tokenIds,
    tokenAmounts
  );
  return { bottlingPlant, palletToken, oliveOilBottleToken, escrow };
}

export async function activeBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant, palletToken, escrow } = await packedBottlingPlantFixture(signers);
  const deployer = signers[0];
  await bottlingPlant.depositToken(idBottlingPlantPallet1, palletPrice, deployer.address);
  await bottlingPlant.depositBatch([idBottlingPlantPallet2, idBottlingPlantPallet3], palletPrice, deployer.address);
  return { bottlingPlant, palletToken, escrow };
}

export async function depositedBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant, palletToken, escrow } = await activeBottlingPlantFixture(signers);
  const acc2 = signers[1];
  const acc3 = signers[2];
  await escrow.connect(acc2).makePayment(0, acc3.address, palletOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, palletOptions);
  return { bottlingPlant, palletToken, escrow };
}

export async function paymentBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant } = await initializedBottlingPlantFixture(signers);
  const { escrow } = await activeOliveOilEscrowFixture(signers);
  return { bottlingPlant, escrow };
}

export async function depositedPaymentBottlingPlantFixture(signers: Wallet[]): Promise<{
  bottlingPlant: BottlingPlantUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { bottlingPlant, escrow } = await paymentBottlingPlantFixture(signers);
  await bottlingPlant.makePayment(escrow.address, 0, bottlingPlant.address, oliveOilOptions);
  return { bottlingPlant, escrow };
}

/**
 * Distributor
 */
export async function distributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { palletToken, oliveOilBottleToken } = await packedPalletFixture(signers);
  const escrow = await deployIndustrialUnitsEscrow(deployer);
  const distributor = (await deploy(dictContracts.distributorWithInit.v1, deployer)) as DistributorUpgradeableWithInit;
  return { distributor, palletToken, oliveOilBottleToken, escrow };
}

export async function initializedDistributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { distributor, palletToken, oliveOilBottleToken, escrow } = await distributorFixture(signers);
  await distributor.initialize(palletToken.address, escrow.address);
  await palletToken.transferOwnership(distributor.address);
  await escrow.transferOwnership(distributor.address);
  return { distributor, palletToken, oliveOilBottleToken, escrow };
}

export async function distributorWithStockFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { distributor, palletToken, oliveOilBottleToken, escrow } = await initializedDistributorFixture(signers);
  const intIds = await Promise.all(
    [idDefaultPallet1, idDefaultPallet2, idDefaultPallet3].map(async (id) => {
      return await palletToken.bytesToIntId(id);
    })
  );
  await palletToken.safeBatchTransferFrom(deployer.address, distributor.address, intIds, [1, 1, 1], bytes32Data);
  await distributor.unpackBatch(palletToken.address, [idDefaultPallet1, idDefaultPallet2, idDefaultPallet3]);
  return { distributor, palletToken, oliveOilBottleToken, escrow };
}

export async function packedDistributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { distributor, palletToken, oliveOilBottleToken, escrow } = await distributorWithStockFixture(signers);
  const tokenAddresses = [
    [oliveOilBottleToken.address, oliveOilBottleToken.address],
    [oliveOilBottleToken.address, oliveOilBottleToken.address],
    [oliveOilBottleToken.address]
  ];
  const tokenTypeIds = [
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottle]
  ];
  const tokenIds = [
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [idOliveOilExtraVirginIntenseGlassBottleToken1]
  ];
  const tokenAmounts = [
    [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
    [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
    [oliveOilBottleUnitsToPack]
  ];
  await distributor.packBatch(
    [idDistributorPallet1, idDistributorPallet2, idDistributorPallet3],
    tokenAddresses,
    tokenTypeIds,
    tokenIds,
    tokenAmounts
  );
  return { distributor, palletToken, oliveOilBottleToken, escrow };
}

export async function activeDistributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { distributor, palletToken, escrow } = await packedDistributorFixture(signers);
  const deployer = signers[0];
  await distributor.depositToken(idDistributorPallet1, palletPrice, deployer.address);
  await distributor.depositBatch([idDistributorPallet2, idDistributorPallet3], palletPrice, deployer.address);
  return { distributor, palletToken, escrow };
}

export async function depositedDistributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { distributor, palletToken, escrow } = await activeDistributorFixture(signers);
  const acc2 = signers[1];
  const acc3 = signers[2];
  await escrow.connect(acc2).makePayment(0, acc3.address, palletOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, palletOptions);
  return { distributor, palletToken, escrow };
}

export async function paymentDistributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { distributor } = await initializedDistributorFixture(signers);
  const { escrow } = await activePalletEscrowFixture(signers);
  return { distributor, escrow };
}

export async function depositedPaymentDistributorFixture(signers: Wallet[]): Promise<{
  distributor: DistributorUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { distributor, escrow } = await paymentDistributorFixture(signers);
  await distributor.makePayment(escrow.address, 0, distributor.address, palletOptions);
  return { distributor, escrow };
}

/**
 * Retailer
 */
export async function retailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { palletToken, oliveOilBottleToken } = await packedPalletFixture(signers);
  const escrow = await deployCommercialUnitsEscrow(deployer);
  const retailer = (await deploy(dictContracts.retailerWithInit.v1, deployer)) as RetailerUpgradeableWithInit;
  return { retailer, palletToken, oliveOilBottleToken, escrow };
}

export async function initializedRetailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { retailer, palletToken, oliveOilBottleToken, escrow } = await retailerFixture(signers);
  await retailer.initialize(escrow.address);
  await escrow.transferOwnership(retailer.address);
  return { retailer, palletToken, oliveOilBottleToken, escrow };
}

export async function packedRetailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { retailer, palletToken, oliveOilBottleToken, escrow } = await initializedRetailerFixture(signers);
  const intIds = await Promise.all(
    [idDefaultPallet1, idDefaultPallet2, idDefaultPallet3].map(async (id) => {
      return await palletToken.bytesToIntId(id);
    })
  );
  await palletToken.safeBatchTransferFrom(deployer.address, retailer.address, intIds, [1, 1, 1], bytes32Data);
  return { retailer, palletToken, oliveOilBottleToken, escrow };
}

export async function retailerWithStockFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { retailer, palletToken, oliveOilBottleToken, escrow } = await packedRetailerFixture(signers);
  await retailer.unpackBatch(palletToken.address, [idDefaultPallet1, idDefaultPallet2, idDefaultPallet3]);
  return { retailer, palletToken, oliveOilBottleToken, escrow };
}

export async function activeRetailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const deployer = signers[0];
  const { retailer, palletToken, oliveOilBottleToken, escrow } = await retailerWithStockFixture(signers);
  await retailer.depositToken(
    oliveOilBottleToken.address,
    idOliveOilExtraVirginIntenseGlassBottle,
    idOliveOilExtraVirginIntenseGlassBottleToken1,
    oliveOilBottleUnitsToEscrow,
    oliveOilBottlePrice,
    retailer.address
  );
  await retailer.depositBatch(
    oliveOilBottleToken.address,
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [idOliveOilExtraVirginIntenseGlassBottleToken1, idOliveOilExtraVirginSmoothPlasticBottleToken1],
    [oliveOilBottleUnitsToEscrow, oliveOilBottleUnitsToEscrow],
    oliveOilBottlePrice,
    deployer.address
  );
  return { retailer, palletToken, oliveOilBottleToken, escrow };
}

export async function depositedRetailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  palletToken: IndustrialUnitTokenUpgradeableWithInit;
  oliveOilBottleToken: DependentTokenUpgradeableWithInit;
  escrow: CommercialUnitsEscrowUpgradeableWithInit;
}> {
  const { retailer, palletToken, oliveOilBottleToken, escrow } = await activeRetailerFixture(signers);
  const acc2 = signers[1];
  const acc3 = signers[2];
  await escrow.connect(acc2).makePayment(0, acc3.address, oliveOilBottleOptions);
  await escrow.connect(acc2).makePayment(1, acc3.address, oliveOilBottleOptions);
  return { retailer, palletToken, oliveOilBottleToken, escrow };
}

export async function paymentRetailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { retailer } = await initializedRetailerFixture(signers);
  const { escrow } = await activePalletEscrowFixture(signers);
  return { retailer, escrow };
}

export async function depositedPaymentRetailerFixture(signers: Wallet[]): Promise<{
  retailer: RetailerUpgradeableWithInit;
  escrow: IndustrialUnitsEscrowUpgradeableWithInit;
}> {
  const { retailer, escrow } = await paymentRetailerFixture(signers);
  await retailer.makePayment(escrow.address, 0, retailer.address, palletOptions);
  return { retailer, escrow };
}
