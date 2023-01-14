import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from 'hardhat-env/shared/constants';
import { CertifierCompany, CertifierCompanyCertificate } from 'hardhat-env/types';
import shouldBehaveLikeInitialize from 'hardhat-env/test/members/CertifierCompany/effects/initialize';
import { deployCertifierAndDeps } from 'hardhat-env/shared/helpers';

export function shouldBehaveLikeCertifierCompany(): void {
  const certifierId = dictChainActorsNames.certifier.id1;
  const certifierCompanyContractName = dictContracts.certifierCompany.v1;
  const certifierCompanyCertificateContractName = dictContracts.certifierCompanyCertificate.v1;
  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { certifier, certifierCertificate } = await deployCertifierAndDeps(
          certifierCompanyContractName,
          certifierCompanyCertificateContractName,
          baseUri,
          this.signers.deployer,
          uupsOpts
        );
        this.contracts.certifierCompany = certifier.proxy as CertifierCompany;
        this.contracts.certifierCompanyCertificate = certifierCertificate.proxy as CertifierCompanyCertificate;
      });

      shouldBehaveLikeInitialize(certifierId);
    });
  });
}
