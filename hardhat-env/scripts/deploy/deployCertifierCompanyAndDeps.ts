import { ethers } from 'hardhat';
import { baseUri, dictAccounts, dictContracts, dictInheritedModules, uupsOpts } from '@shared/constants';
import { deployCertifierAndDeps } from '@shared/helpers';
import { IDeployedActorAndDeps } from '@shared/types';

export async function deployCertifierCompanyAndDeps(): Promise<IDeployedActorAndDeps[]> {
  const { certifierCompany, certifierCompanyCertificate } = dictContracts;
  const certifierCompanyContractName = certifierCompany.v1;
  const certifierCompanyCertificateContractName = certifierCompanyCertificate.v1;
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
