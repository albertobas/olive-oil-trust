import { existsSync, readFileSync } from 'fs';
import { task } from 'hardhat/config';
import { join } from 'path';
import '@nomiclabs/hardhat-ethers';
import {
  dictBottle,
  dictOliveOil,
  dictOlives,
  dictCertificate,
  dictOliveOilBottle,
  dictPallet
} from 'hardhat-env/test/shared/constants';
import { utils } from 'ethers';
import { dictAccounts, dictContracts } from 'hardhat-env/shared/constants';
import {
  BottleCompany,
  BottleCompanyBottle,
  BottleCompanyEscrow,
  BottlingCompany,
  BottlingCompanyEscrow,
  BottlingCompanyOliveOilBottle,
  BottlingCompanyPallet,
  CertifierCompany,
  CertifierCompanyCertificate,
  DistributorCompany,
  DistributorCompanyEscrow,
  DistributorCompanyPallet,
  OliveGrowerOne,
  OliveGrowerOneEscrow,
  OliveGrowerOneOlives,
  OliveOilMillCompany,
  OliveOilMillCompanyEscrow,
  OliveOilMillCompanyOliveOil,
  RetailerCompany,
  RetailerCompanyEscrow
} from 'hardhat-env/types';

task('setState', 'Perform all the transactions').setAction(async (_, hre) => {
  if (hre.network.name === 'hardhat') {
    console.warn(
      'The faucet has been run to the Hardhat Network, so it got automatically created ' +
        "and destroyed. Use the Hardhat option '--network localhost'"
    );
  }
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);
  const idPicualToken1 = utils.formatBytes32String(dictOlives.picual.tokenId1);
  const idArbequinaToken1 = utils.formatBytes32String(dictOlives.arbequina.tokenId1);
  const idPicualToken2 = utils.formatBytes32String(dictOlives.picual.tokenId2);
  const idArbequinaToken2 = utils.formatBytes32String(dictOlives.arbequina.tokenId2);
  const idGlass1 = utils.formatBytes32String(dictBottle.glass.id1);
  const idPlastic1 = utils.formatBytes32String(dictBottle.plastic.id1);
  const idGlass2 = utils.formatBytes32String(dictBottle.glass.id2);
  const idPlastic2 = utils.formatBytes32String(dictBottle.plastic.id2);
  const idGlassToken1 = utils.formatBytes32String(dictBottle.glass.tokenId1);
  const idPlasticToken1 = utils.formatBytes32String(dictBottle.plastic.tokenId1);
  const idGlassToken2 = utils.formatBytes32String(dictBottle.glass.tokenId2);
  const idPlasticToken2 = utils.formatBytes32String(dictBottle.plastic.tokenId2);
  const idGlassToken3 = utils.formatBytes32String(dictBottle.glass.tokenId3);
  const idPlasticToken3 = utils.formatBytes32String(dictBottle.plastic.tokenId3);
  const idGlassToken4 = utils.formatBytes32String(dictBottle.glass.tokenId4);
  const idPlasticToken4 = utils.formatBytes32String(dictBottle.plastic.tokenId4);
  const idOliveOilExtraVirginIntense = utils.formatBytes32String(dictOliveOil.extraVirginIntense.id);
  const idOliveOilExtraVirginSmooth = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.id);
  const idOliveOilExtraVirginIntenseToken1 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId1);
  const idOliveOilExtraVirginSmoothToken1 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId1);
  const idOliveOilExtraVirginIntenseToken2 = utils.formatBytes32String(dictOliveOil.extraVirginIntense.tokenId2);
  const idOliveOilExtraVirginSmoothToken2 = utils.formatBytes32String(dictOliveOil.extraVirginSmooth.tokenId2);
  const idBottlingPlantPallet1 = utils.formatBytes32String(dictPallet.bottlingPlant.id1);
  const idBottlingPlantPallet2 = utils.formatBytes32String(dictPallet.bottlingPlant.id2);
  const idDistributorPallet1 = utils.formatBytes32String(dictPallet.distributor.id1);
  const idDistributorPallet2 = utils.formatBytes32String(dictPallet.distributor.id2);
  const idCertificateBottlesHQGlass750 = utils.formatBytes32String(dictCertificate.bottles.hQGlass750);
  const idCertificateExtraVirginIntense = utils.formatBytes32String(dictCertificate.oliveOil.extraVirginIntense);
  const olivesUnitsToMint = dictOlives.unitsToMint;
  const olivesUnitsToEscrow = dictOlives.unitsToEscrow;
  const bottlesUnitsToMint = dictBottle.unitsToMint;
  const bottlesUnitsToEscrow = dictBottle.unitsToEscrow;
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
  const idOliveOilExtraVirginIntenseGlassBottleToken2 = utils.formatBytes32String(
    dictOliveOilBottle.extraVirginIntenseGlass.tokenId2
  );
  const idOliveOilExtraVirginSmoothPlasticBottleToken2 = utils.formatBytes32String(
    dictOliveOilBottle.extraVirginSmoothPlastic.tokenId2
  );
  const extraVirginIntenseGlassBottleOliveOilUnits = dictOliveOilBottle.extraVirginIntenseGlass.oliveOilUnits;
  const extraVirginSmoothPlasticBottleOliveOilUnits = dictOliveOilBottle.extraVirginSmoothPlastic.oliveOilUnits;
  const extraVirginIntenseGlassBottleBottlesUnits = dictOliveOilBottle.extraVirginIntenseGlass.bottleUnits;
  const extraVirginSmoothPlasticBottleBottlesUnits = dictOliveOilBottle.extraVirginSmoothPlastic.bottleUnits;
  const bottleCompanyAddressPath = join(__dirname, `../deployments/localhost/${dictContracts.bottleCompany.v1}.json`);
  const bottleCompanyBottleAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottleCompanyBottle.v1}.json`
  );
  const bottleCompanyEscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottleCompanyEscrow.v1}.json`
  );
  const bottleCompany2AddressPath = join(__dirname, `../deployments/localhost/${dictContracts.bottleCompany2.v1}.json`);
  const bottleCompany2BottleAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottleCompany2Bottle.v1}.json`
  );
  const bottleCompany2EscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottleCompany2Escrow.v1}.json`
  );
  const bottlingCompanyAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottlingCompany.v1}.json`
  );
  const bottlingCompanyEscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottlingCompanyEscrow.v1}.json`
  );
  const bottlingCompanyOliveOilBottleAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottlingCompanyOliveOilBottle.v1}.json`
  );
  const bottlingCompanyPalletAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.bottlingCompanyPallet.v1}.json`
  );
  const certifierCompanyAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.certifierCompany.v1}.json`
  );
  const certifierCompanyCertificateAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.certifierCompanyCertificate.v1}.json`
  );
  const distributorCompanyAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.distributorCompany.v1}.json`
  );
  const distributorCompanyEscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.distributorCompanyEscrow.v1}.json`
  );
  const distributorCompanyPalletAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.distributorCompanyPallet.v1}.json`
  );
  const oliveGrowerOneAddressPath = join(__dirname, `../deployments/localhost/${dictContracts.oliveGrowerOne.v1}.json`);
  const oliveGrowerOneEscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.oliveGrowerOneEscrow.v1}.json`
  );
  const oliveGrowerOneOlivesAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.oliveGrowerOneOlives.v1}.json`
  );
  const oliveOilMillCompanyAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.oliveOilMillCompany.v1}.json`
  );
  const oliveOilMillCompanyEscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.oliveOilMillCompanyEscrow.v1}.json`
  );
  const oliveOilMillCompanyOliveOilAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.oliveOilMillCompanyOliveOil.v1}.json`
  );
  const retailerCompanyAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.retailerCompany.v1}.json`
  );
  const retailerCompanyEscrowAddressPath = join(
    __dirname,
    `../deployments/localhost/${dictContracts.retailerCompanyEscrow.v1}.json`
  );
  if (
    !existsSync(bottleCompanyAddressPath) ||
    !existsSync(bottleCompanyBottleAddressPath) ||
    !existsSync(bottleCompanyEscrowAddressPath) ||
    !existsSync(bottleCompany2AddressPath) ||
    !existsSync(bottleCompany2BottleAddressPath) ||
    !existsSync(bottleCompany2EscrowAddressPath) ||
    !existsSync(bottlingCompanyAddressPath) ||
    !existsSync(bottlingCompanyEscrowAddressPath) ||
    !existsSync(bottlingCompanyOliveOilBottleAddressPath) ||
    !existsSync(bottlingCompanyPalletAddressPath) ||
    !existsSync(certifierCompanyAddressPath) ||
    !existsSync(certifierCompanyCertificateAddressPath) ||
    !existsSync(distributorCompanyAddressPath) ||
    !existsSync(distributorCompanyEscrowAddressPath) ||
    !existsSync(distributorCompanyPalletAddressPath) ||
    !existsSync(oliveGrowerOneAddressPath) ||
    !existsSync(oliveGrowerOneEscrowAddressPath) ||
    !existsSync(oliveGrowerOneOlivesAddressPath) ||
    !existsSync(oliveOilMillCompanyAddressPath) ||
    !existsSync(oliveOilMillCompanyEscrowAddressPath) ||
    !existsSync(oliveOilMillCompanyOliveOilAddressPath) ||
    !existsSync(retailerCompanyAddressPath) ||
    !existsSync(retailerCompanyEscrowAddressPath)
  ) {
    console.error('You need to deploy your contract first');
    return;
  }
  const bottleCompanyAddressFile = readFileSync(bottleCompanyAddressPath, 'utf-8');
  const bottleCompanyAddress = JSON.parse(bottleCompanyAddressFile).address;
  const bottleCompany = (await hre.ethers.getContractAt(
    dictContracts.bottleCompany.v1,
    bottleCompanyAddress
  )) as BottleCompany;
  const bottleCompanyBottleAddressFile = readFileSync(bottleCompanyBottleAddressPath, 'utf-8');
  const bottleCompanyBottleAddress = JSON.parse(bottleCompanyBottleAddressFile).address;
  const bottleCompanyBottle = (await hre.ethers.getContractAt(
    dictContracts.bottleCompanyBottle.v1,
    bottleCompanyBottleAddress
  )) as BottleCompanyBottle;
  const bottleCompanyEscrowAddressFile = readFileSync(bottleCompanyEscrowAddressPath, 'utf-8');
  const bottleCompanyEscrowAddress = JSON.parse(bottleCompanyEscrowAddressFile).address;
  const bottleCompanyEscrow = (await hre.ethers.getContractAt(
    dictContracts.bottleCompanyEscrow.v1,
    bottleCompanyEscrowAddress
  )) as BottleCompanyEscrow;
  const bottleCompany2AddressFile = readFileSync(bottleCompany2AddressPath, 'utf-8');
  const bottleCompany2Address = JSON.parse(bottleCompany2AddressFile).address;
  const bottleCompany2 = (await hre.ethers.getContractAt(
    dictContracts.bottleCompany2.v1,
    bottleCompany2Address
  )) as BottleCompany;
  const bottleCompany2BottleAddressFile = readFileSync(bottleCompany2BottleAddressPath, 'utf-8');
  const bottleCompany2BottleAddress = JSON.parse(bottleCompany2BottleAddressFile).address;
  const bottleCompany2Bottle = (await hre.ethers.getContractAt(
    dictContracts.bottleCompany2Bottle.v1,
    bottleCompany2BottleAddress
  )) as BottleCompanyBottle;
  const bottleCompany2EscrowAddressFile = readFileSync(bottleCompany2EscrowAddressPath, 'utf-8');
  const bottleCompany2EscrowAddress = JSON.parse(bottleCompany2EscrowAddressFile).address;
  const bottleCompany2Escrow = (await hre.ethers.getContractAt(
    dictContracts.bottleCompany2Escrow.v1,
    bottleCompany2EscrowAddress
  )) as BottleCompanyEscrow;
  const bottlingCompanyAddressFile = readFileSync(bottlingCompanyAddressPath, 'utf-8');
  const bottlingCompanyAddress = JSON.parse(bottlingCompanyAddressFile).address;
  const bottlingCompany = (await hre.ethers.getContractAt(
    dictContracts.bottlingCompany.v1,
    bottlingCompanyAddress
  )) as BottlingCompany;
  const bottlingCompanyEscrowAddressFile = readFileSync(bottlingCompanyEscrowAddressPath, 'utf-8');
  const bottlingCompanyEscrowAddress = JSON.parse(bottlingCompanyEscrowAddressFile).address;
  const bottlingCompanyEscrow = (await hre.ethers.getContractAt(
    dictContracts.bottlingCompanyEscrow.v1,
    bottlingCompanyEscrowAddress
  )) as BottlingCompanyEscrow;
  const bottlingCompanyOliveOilBottleAddressFile = readFileSync(bottlingCompanyOliveOilBottleAddressPath, 'utf-8');
  const bottlingCompanyOliveOilBottleAddress = JSON.parse(bottlingCompanyOliveOilBottleAddressFile).address;
  const bottlingCompanyOliveOilBottle = (await hre.ethers.getContractAt(
    dictContracts.bottlingCompanyOliveOilBottle.v1,
    bottlingCompanyOliveOilBottleAddress
  )) as BottlingCompanyOliveOilBottle;
  const bottlingCompanyPalletAddressFile = readFileSync(bottlingCompanyPalletAddressPath, 'utf-8');
  const bottlingCompanyPalletAddress = JSON.parse(bottlingCompanyPalletAddressFile).address;
  const bottlingCompanyPallet = (await hre.ethers.getContractAt(
    dictContracts.bottlingCompanyPallet.v1,
    bottlingCompanyPalletAddress
  )) as BottlingCompanyPallet;
  const certifierCompanyAddressFile = readFileSync(certifierCompanyAddressPath, 'utf-8');
  const certifierCompanyAddress = JSON.parse(certifierCompanyAddressFile).address;
  const certifierCompany = (await hre.ethers.getContractAt(
    dictContracts.certifierCompany.v1,
    certifierCompanyAddress
  )) as CertifierCompany;
  const certifierCompanyCertificateAddressFile = readFileSync(certifierCompanyCertificateAddressPath, 'utf-8');
  const certifierCompanyCertificateAddress = JSON.parse(certifierCompanyCertificateAddressFile).address;
  const certifierCompanyCertificate = (await hre.ethers.getContractAt(
    dictContracts.certifierCompanyCertificate.v1,
    certifierCompanyCertificateAddress
  )) as CertifierCompanyCertificate;
  const distributorCompanyAddressFile = readFileSync(distributorCompanyAddressPath, 'utf-8');
  const distributorCompanyAddress = JSON.parse(distributorCompanyAddressFile).address;
  const distributorCompany = (await hre.ethers.getContractAt(
    dictContracts.distributorCompany.v1,
    distributorCompanyAddress
  )) as DistributorCompany;
  const distributorCompanyEscrowAddressFile = readFileSync(distributorCompanyEscrowAddressPath, 'utf-8');
  const distributorCompanyEscrowAddress = JSON.parse(distributorCompanyEscrowAddressFile).address;
  const distributorCompanyEscrow = (await hre.ethers.getContractAt(
    dictContracts.distributorCompanyEscrow.v1,
    distributorCompanyEscrowAddress
  )) as DistributorCompanyEscrow;
  const distributorCompanyPalletAddressFile = readFileSync(distributorCompanyPalletAddressPath, 'utf-8');
  const distributorCompanyPalletAddress = JSON.parse(distributorCompanyPalletAddressFile).address;
  const distributorCompanyPallet = (await hre.ethers.getContractAt(
    dictContracts.distributorCompanyPallet.v1,
    distributorCompanyPalletAddress
  )) as DistributorCompanyPallet;
  const oliveGrowerOneAddressFile = readFileSync(oliveGrowerOneAddressPath, 'utf-8');
  const oliveGrowerOneAddress = JSON.parse(oliveGrowerOneAddressFile).address;
  const oliveGrowerOne = (await hre.ethers.getContractAt(
    dictContracts.oliveGrowerOne.v1,
    oliveGrowerOneAddress
  )) as OliveGrowerOne;
  const oliveGrowerOneEscrowAddressFile = readFileSync(oliveGrowerOneEscrowAddressPath, 'utf-8');
  const oliveGrowerOneEscrowAddress = JSON.parse(oliveGrowerOneEscrowAddressFile).address;
  const oliveGrowerOneEscrow = (await hre.ethers.getContractAt(
    dictContracts.oliveGrowerOneEscrow.v1,
    oliveGrowerOneEscrowAddress
  )) as OliveGrowerOneEscrow;
  const oliveGrowerOneOlivesAddressFile = readFileSync(oliveGrowerOneOlivesAddressPath, 'utf-8');
  const oliveGrowerOneOlivesAddress = JSON.parse(oliveGrowerOneOlivesAddressFile).address;
  const oliveGrowerOneOlives = (await hre.ethers.getContractAt(
    dictContracts.oliveGrowerOneOlives.v1,
    oliveGrowerOneOlivesAddress
  )) as OliveGrowerOneOlives;
  const oliveOilMillCompanyAddressFile = readFileSync(oliveOilMillCompanyAddressPath, 'utf-8');
  const oliveOilMillCompanyAddress = JSON.parse(oliveOilMillCompanyAddressFile).address;
  const oliveOilMillCompany = (await hre.ethers.getContractAt(
    dictContracts.oliveOilMillCompany.v1,
    oliveOilMillCompanyAddress
  )) as OliveOilMillCompany;
  const oliveOilMillCompanyEscrowAddressFile = readFileSync(oliveOilMillCompanyEscrowAddressPath, 'utf-8');
  const oliveOilMillCompanyEscrowAddress = JSON.parse(oliveOilMillCompanyEscrowAddressFile).address;
  const oliveOilMillCompanyEscrow = (await hre.ethers.getContractAt(
    dictContracts.oliveOilMillCompanyEscrow.v1,
    oliveOilMillCompanyEscrowAddress
  )) as OliveOilMillCompanyEscrow;
  const oliveOilMillCompanyOliveOilAddressFile = readFileSync(oliveOilMillCompanyOliveOilAddressPath, 'utf-8');
  const oliveOilMillCompanyOliveOilAddress = JSON.parse(oliveOilMillCompanyOliveOilAddressFile).address;
  const oliveOilMillCompanyOliveOil = (await hre.ethers.getContractAt(
    dictContracts.oliveOilMillCompanyOliveOil.v1,
    oliveOilMillCompanyOliveOilAddress
  )) as OliveOilMillCompanyOliveOil;
  const retailerCompanyAddressFile = readFileSync(retailerCompanyAddressPath, 'utf-8');
  const retailerCompanyAddress = JSON.parse(retailerCompanyAddressFile).address;
  const retailerCompany = (await hre.ethers.getContractAt(
    dictContracts.retailerCompany.v1,
    retailerCompanyAddress
  )) as RetailerCompany;
  const retailerCompanyEscrowAddressFile = readFileSync(retailerCompanyEscrowAddressPath, 'utf-8');
  const retailerCompanyEscrowAddress = JSON.parse(retailerCompanyEscrowAddressFile).address;
  const retailerCompanyEscrow = (await hre.ethers.getContractAt(
    dictContracts.retailerCompanyEscrow.v1,
    retailerCompanyEscrowAddress
  )) as RetailerCompanyEscrow;
  const accounts = await hre.ethers.getSigners();
  const oliveGrowerOneAccount = accounts[dictAccounts.OliveGrowerOne];
  const bottleCompanyAccount = accounts[dictAccounts.BottleCompany];
  const bottleCompany2Account = accounts[dictAccounts.BottleCompany2];
  const bottlingCompanyAccount = accounts[dictAccounts.BottlingCompany];
  const oliveOilMillCompanyAccount = accounts[dictAccounts.OliveOilMillCompany];
  const distributorCompanyAccount = accounts[dictAccounts.DistributorCompany];
  const retailerCompanyAccount = accounts[dictAccounts.RetailerCompany];
  const certifierCompanyAccount = accounts[dictAccounts.CertifierCompany];
  const endCustomerOneAccount = accounts[dictAccounts.EndCustomerOne];

  await oliveGrowerOne
    .connect(oliveGrowerOneAccount)
    .mintBatch(
      [idPicual, idPicual, idArbequina, idArbequina],
      [idPicualToken1, idPicualToken2, idArbequinaToken1, idArbequinaToken2],
      [olivesUnitsToMint, olivesUnitsToMint, olivesUnitsToMint, olivesUnitsToMint]
    );

  await oliveGrowerOne
    .connect(oliveGrowerOneAccount)
    .depositBatch(
      [idPicual, idPicual, idArbequina, idArbequina],
      [idPicualToken1, idPicualToken2, idArbequinaToken1, idArbequinaToken2],
      [olivesUnitsToEscrow, olivesUnitsToEscrow, olivesUnitsToEscrow, olivesUnitsToEscrow],
      oliveGrowerOneAccount.address
    );

  await oliveOilMillCompany
    .connect(oliveOilMillCompanyAccount)
    .makeOffer(oliveGrowerOneEscrow.address, 0, oliveOilMillCompanyAccount.address, olivesOptions);

  await oliveGrowerOne.connect(oliveGrowerOneAccount).closeEscrow(0);

  await oliveOilMillCompany
    .connect(oliveOilMillCompanyAccount)
    .setTokenTypesInstructions(
      [idOliveOilExtraVirginIntense, idOliveOilExtraVirginSmooth],
      [[oliveGrowerOneOlives.address], [oliveGrowerOneOlives.address]],
      [[idPicual], [idArbequina]],
      [[extraVirginIntenseOlivesUnits], [extraVirginSmoothOlivesUnits]]
    );

  await oliveOilMillCompany.connect(oliveOilMillCompanyAccount).mintBatch(
    [
      idOliveOilExtraVirginIntense,
      idOliveOilExtraVirginIntense,
      idOliveOilExtraVirginSmooth,
      idOliveOilExtraVirginSmooth
    ],
    [
      idOliveOilExtraVirginIntenseToken1,
      idOliveOilExtraVirginIntenseToken2,
      idOliveOilExtraVirginSmoothToken1,
      idOliveOilExtraVirginSmoothToken2
    ],
    [oliveOilUnitsToMint, oliveOilUnitsToMint, oliveOilUnitsToMint, oliveOilUnitsToMint],
    [
      {
        inputTokenAddresses: [[oliveGrowerOneOlives.address]],
        inputTokenTypeIds: [[idPicual]],
        inputTokenIds: [[idPicualToken1]],
        inputTokenAmounts: [[oliveOilUnitsToMint * extraVirginIntenseOlivesUnits]]
      },
      {
        inputTokenAddresses: [[oliveGrowerOneOlives.address]],
        inputTokenTypeIds: [[idPicual]],
        inputTokenIds: [[idPicualToken2]],
        inputTokenAmounts: [[oliveOilUnitsToMint * extraVirginIntenseOlivesUnits]]
      },
      {
        inputTokenAddresses: [[oliveGrowerOneOlives.address]],
        inputTokenTypeIds: [[idArbequina]],
        inputTokenIds: [[idArbequinaToken1]],
        inputTokenAmounts: [[oliveOilUnitsToMint * extraVirginSmoothOlivesUnits]]
      },
      {
        inputTokenAddresses: [[oliveGrowerOneOlives.address]],
        inputTokenTypeIds: [[idArbequina]],
        inputTokenIds: [[idArbequinaToken2]],
        inputTokenAmounts: [[oliveOilUnitsToMint * extraVirginSmoothOlivesUnits]]
      }
    ]
  );

  await oliveOilMillCompany
    .connect(oliveOilMillCompanyAccount)
    .depositBatch(
      [
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginIntense,
        idOliveOilExtraVirginSmooth,
        idOliveOilExtraVirginSmooth
      ],
      [
        idOliveOilExtraVirginIntenseToken1,
        idOliveOilExtraVirginIntenseToken2,
        idOliveOilExtraVirginSmoothToken1,
        idOliveOilExtraVirginSmoothToken2
      ],
      [oliveOilUnitsToEscrow, oliveOilUnitsToEscrow, oliveOilUnitsToEscrow, oliveOilUnitsToEscrow],
      oliveOilPrice,
      oliveOilMillCompanyAccount.address
    );

  await bottleCompany
    .connect(bottleCompanyAccount)
    .mintBatch(
      [idGlass1, idGlass1, idPlastic1, idPlastic1],
      [idGlassToken1, idGlassToken2, idPlasticToken1, idPlasticToken2],
      [bottlesUnitsToMint, bottlesUnitsToMint, bottlesUnitsToMint, bottlesUnitsToMint]
    );

  await bottleCompany
    .connect(bottleCompanyAccount)
    .depositBatch(
      [idGlass1, idGlass1, idPlastic1, idPlastic1],
      [idGlassToken1, idGlassToken2, idPlasticToken1, idPlasticToken2],
      [bottlesUnitsToEscrow, bottlesUnitsToEscrow, bottlesUnitsToEscrow, bottlesUnitsToEscrow],
      bottlePrice,
      bottleCompanyAccount.address
    );

  await bottleCompany2
    .connect(bottleCompany2Account)
    .mintBatch(
      [idGlass2, idGlass2, idPlastic2, idPlastic2],
      [idGlassToken3, idGlassToken4, idPlasticToken3, idPlasticToken4],
      [bottlesUnitsToMint, bottlesUnitsToMint, bottlesUnitsToMint, bottlesUnitsToMint]
    );

  await bottleCompany2
    .connect(bottleCompany2Account)
    .depositBatch(
      [idGlass2, idGlass2, idPlastic2, idPlastic2],
      [idGlassToken3, idGlassToken4, idPlasticToken3, idPlasticToken4],
      [bottlesUnitsToEscrow, bottlesUnitsToEscrow, bottlesUnitsToEscrow, bottlesUnitsToEscrow],
      bottlePrice,
      bottleCompany2Account.address
    );

  await bottlingCompany
    .connect(bottlingCompanyAccount)
    .makePayment(oliveOilMillCompanyEscrow.address, 0, bottlingCompanyAccount.address, oliveOilOptions);

  await bottlingCompany
    .connect(bottlingCompanyAccount)
    .makePayment(bottleCompanyEscrow.address, 0, bottlingCompanyAccount.address, bottlesOptions);

  await bottlingCompany
    .connect(bottlingCompanyAccount)
    .makePayment(bottleCompany2Escrow.address, 0, bottlingCompanyAccount.address, bottlesOptions);

  await oliveOilMillCompany.connect(oliveOilMillCompanyAccount).closeEscrow(0);

  await bottleCompany.connect(bottleCompanyAccount).closeEscrow(0);

  await bottleCompany2.connect(bottleCompany2Account).closeEscrow(0);

  await certifierCompany
    .connect(certifierCompanyAccount)
    .certifyBatch(
      [idCertificateExtraVirginIntense, idCertificateBottlesHQGlass750, idCertificateBottlesHQGlass750],
      [oliveOilMillCompanyOliveOil.address, bottleCompanyBottle.address, bottleCompany2Bottle.address],
      [idOliveOilExtraVirginIntense, idGlass1, idGlass2]
    );

  await bottlingCompany.connect(bottlingCompanyAccount).setTokenTypesInstructions(
    [idOliveOilExtraVirginIntenseGlassBottle, idOliveOilExtraVirginSmoothPlasticBottle],
    [
      [certifierCompanyCertificate.address, certifierCompanyCertificate.address],
      [oliveOilMillCompanyOliveOil.address, bottleCompanyBottle.address]
    ],
    [
      [idCertificateExtraVirginIntense, idCertificateBottlesHQGlass750],
      [idOliveOilExtraVirginSmooth, idPlastic1]
    ],
    [
      [extraVirginIntenseGlassBottleOliveOilUnits, extraVirginIntenseGlassBottleBottlesUnits],
      [extraVirginSmoothPlasticBottleOliveOilUnits, extraVirginSmoothPlasticBottleBottlesUnits]
    ]
  );

  await bottlingCompany.connect(bottlingCompanyAccount).mintBatch(
    [
      idOliveOilExtraVirginIntenseGlassBottle,
      idOliveOilExtraVirginIntenseGlassBottle,
      idOliveOilExtraVirginSmoothPlasticBottle,
      idOliveOilExtraVirginSmoothPlasticBottle
    ],
    [
      idOliveOilExtraVirginIntenseGlassBottleToken1,
      idOliveOilExtraVirginIntenseGlassBottleToken2,
      idOliveOilExtraVirginSmoothPlasticBottleToken1,
      idOliveOilExtraVirginSmoothPlasticBottleToken2
    ],
    [oliveOilBottleUnitsToMint, oliveOilBottleUnitsToMint, oliveOilBottleUnitsToMint, oliveOilBottleUnitsToMint],
    [
      {
        inputTokenAddresses: [
          [oliveOilMillCompanyOliveOil.address],
          [bottleCompanyBottle.address, bottleCompany2Bottle.address]
        ],
        inputTokenTypeIds: [[idOliveOilExtraVirginIntense], [idGlass1, idGlass2]],
        inputTokenIds: [[idOliveOilExtraVirginIntenseToken1], [idGlassToken1, idGlassToken3]],
        inputTokenAmounts: [
          [oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleOliveOilUnits],
          [
            (oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleBottlesUnits) / 2,
            (oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleBottlesUnits) / 2
          ]
        ]
      },
      {
        inputTokenAddresses: [
          [oliveOilMillCompanyOliveOil.address],
          [bottleCompanyBottle.address, bottleCompany2Bottle.address]
        ],
        inputTokenTypeIds: [[idOliveOilExtraVirginIntense], [idGlass1, idGlass2]],
        inputTokenIds: [[idOliveOilExtraVirginIntenseToken2], [idGlassToken2, idGlassToken4]],
        inputTokenAmounts: [
          [oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleOliveOilUnits],
          [
            (oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleBottlesUnits) / 2,
            (oliveOilBottleUnitsToMint * extraVirginIntenseGlassBottleBottlesUnits) / 2
          ]
        ]
      },
      {
        inputTokenAddresses: [[oliveOilMillCompanyOliveOil.address], [bottleCompanyBottle.address]],
        inputTokenTypeIds: [[idOliveOilExtraVirginSmooth], [idPlastic1]],
        inputTokenIds: [[idOliveOilExtraVirginSmoothToken1], [idPlasticToken1]],
        inputTokenAmounts: [
          [oliveOilBottleUnitsToMint * extraVirginSmoothPlasticBottleOliveOilUnits],
          [oliveOilBottleUnitsToMint * extraVirginSmoothPlasticBottleBottlesUnits]
        ]
      },
      {
        inputTokenAddresses: [[oliveOilMillCompanyOliveOil.address], [bottleCompanyBottle.address]],
        inputTokenTypeIds: [[idOliveOilExtraVirginSmooth], [idPlastic1]],
        inputTokenIds: [[idOliveOilExtraVirginSmoothToken2], [idPlasticToken2]],
        inputTokenAmounts: [
          [oliveOilBottleUnitsToMint * extraVirginSmoothPlasticBottleOliveOilUnits],
          [oliveOilBottleUnitsToMint * extraVirginSmoothPlasticBottleBottlesUnits]
        ]
      }
    ]
  );

  await bottlingCompany.connect(bottlingCompanyAccount).packBatch(
    [idBottlingPlantPallet1, idBottlingPlantPallet2],
    [
      [
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginSmoothPlasticBottle,
        idOliveOilExtraVirginSmoothPlasticBottle
      ],
      [
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginSmoothPlasticBottle,
        idOliveOilExtraVirginSmoothPlasticBottle
      ]
    ],
    [
      [
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        idOliveOilExtraVirginIntenseGlassBottleToken2,
        idOliveOilExtraVirginSmoothPlasticBottleToken1,
        idOliveOilExtraVirginSmoothPlasticBottleToken2
      ],
      [
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        idOliveOilExtraVirginIntenseGlassBottleToken2,
        idOliveOilExtraVirginSmoothPlasticBottleToken1,
        idOliveOilExtraVirginSmoothPlasticBottleToken2
      ]
    ],
    [
      [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
      [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
    ]
  );

  await bottlingCompany
    .connect(bottlingCompanyAccount)
    .depositBatch([idBottlingPlantPallet1, idBottlingPlantPallet2], palletPrice, bottlingCompanyAccount.address);

  await distributorCompany
    .connect(distributorCompanyAccount)
    .makePayment(bottlingCompanyEscrow.address, 0, distributorCompanyAccount.address, palletOptions);

  await bottlingCompany.connect(bottlingCompanyAccount).closeEscrow(0);

  await distributorCompany
    .connect(distributorCompanyAccount)
    .unpackBatch(bottlingCompanyPallet.address, [idBottlingPlantPallet1, idBottlingPlantPallet2]);

  await distributorCompany.connect(distributorCompanyAccount).packBatch(
    [idDistributorPallet1, idDistributorPallet2],
    [
      [
        bottlingCompanyOliveOilBottle.address,
        bottlingCompanyOliveOilBottle.address,
        bottlingCompanyOliveOilBottle.address,
        bottlingCompanyOliveOilBottle.address
      ],
      [
        bottlingCompanyOliveOilBottle.address,
        bottlingCompanyOliveOilBottle.address,
        bottlingCompanyOliveOilBottle.address,
        bottlingCompanyOliveOilBottle.address
      ]
    ],
    [
      [
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginSmoothPlasticBottle,
        idOliveOilExtraVirginSmoothPlasticBottle
      ],
      [
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginSmoothPlasticBottle,
        idOliveOilExtraVirginSmoothPlasticBottle
      ]
    ],
    [
      [
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        idOliveOilExtraVirginIntenseGlassBottleToken2,
        idOliveOilExtraVirginSmoothPlasticBottleToken1,
        idOliveOilExtraVirginSmoothPlasticBottleToken2
      ],
      [
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        idOliveOilExtraVirginIntenseGlassBottleToken2,
        idOliveOilExtraVirginSmoothPlasticBottleToken1,
        idOliveOilExtraVirginSmoothPlasticBottleToken2
      ]
    ],
    [
      [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack],
      [oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack, oliveOilBottleUnitsToPack]
    ]
  );

  await distributorCompany
    .connect(distributorCompanyAccount)
    .depositBatch([idDistributorPallet1, idDistributorPallet2], palletPrice, distributorCompanyAccount.address);

  await retailerCompany
    .connect(retailerCompanyAccount)
    .makePayment(distributorCompanyEscrow.address, 0, retailerCompanyAccount.address, palletOptions);

  await distributorCompany.connect(distributorCompanyAccount).closeEscrow(0);

  await retailerCompany
    .connect(retailerCompanyAccount)
    .unpackBatch(distributorCompanyPallet.address, [idDistributorPallet1, idDistributorPallet2]);

  await retailerCompany
    .connect(retailerCompanyAccount)
    .depositBatch(
      bottlingCompanyOliveOilBottle.address,
      [
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginIntenseGlassBottle,
        idOliveOilExtraVirginSmoothPlasticBottle,
        idOliveOilExtraVirginSmoothPlasticBottle
      ],
      [
        idOliveOilExtraVirginIntenseGlassBottleToken1,
        idOliveOilExtraVirginIntenseGlassBottleToken2,
        idOliveOilExtraVirginSmoothPlasticBottleToken1,
        idOliveOilExtraVirginSmoothPlasticBottleToken2
      ],
      [1, 1, 1, 1],
      oliveOilBottlePrice,
      retailerCompanyAccount.address
    );

  await retailerCompanyEscrow
    .connect(endCustomerOneAccount)
    .makePayment(0, endCustomerOneAccount.address, oliveOilBottleOptions);

  await retailerCompany.connect(retailerCompanyAccount).closeEscrow(0);

  console.log("The local chain has reached the state specified in the task 'setState'");
});
