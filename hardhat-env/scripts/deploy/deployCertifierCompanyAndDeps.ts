import { ethers } from 'hardhat';
import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from 'hardhat-env/shared/constants';
import { deployCertifierAndDeps } from 'hardhat-env/shared/helpers';
import { IDeployedActorAndDeps } from 'hardhat-env/shared/types';

export async function deployCertifierCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const certifierCompanyContractName = dictContracts.certifierCompany.v1;
  const certifierCompanyCertificateContractName = dictContracts.certifierCompanyCertificate.v1;
  const signers = await ethers.getSigners();
  const { certifier, certifierCertificate } = await deployCertifierAndDeps(
    certifierCompanyContractName,
    certifierCompanyCertificateContractName,
    baseUri,
    signers[dictAccounts.CertifierCompany],
    uupsOpts
  );
  return [
    {
      id: certifierCompanyContractName,
      address: certifier.proxy.address,
      blockNumber: certifier.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.certifierCompany.v1.certifier
    },
    {
      id: certifierCompanyCertificateContractName,
      address: certifierCertificate.proxy.address,
      blockNumber: certifierCertificate.proxy.deployTransaction.blockNumber,
      module: dictInheritedModules.certifierCompany.v1.certificate
    }
  ];
}
