import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import { CertifierCompany, CertifierCompanyCertificate } from '@types';
import shouldBehaveLikeInitialize from '@test/members/CertifierCompany/effects/initialize';
import { deployCertifierAndDeps } from '@shared/helpers';

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
