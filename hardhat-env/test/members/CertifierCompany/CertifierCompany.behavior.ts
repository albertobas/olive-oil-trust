import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import { CertifierCompany, CertifierCompanyCertificate } from '@types';
import shouldBehaveLikeInitialize from '@test/members/CertifierCompany/effects/initialize';
import { deployCertifierAndDeps } from '@shared/helpers';

export function shouldBehaveLikeCertifierCompany(): void {
  const { certifier } = dictChainActorsNames;
  const { certifierCompany, certifierCompanyCertificate } = dictContracts;

  describe('Effects functions', function () {
    describe('#initialize', function () {
      before(async function () {
        const { certifier, certifierCertificate } = await deployCertifierAndDeps(
          certifierCompany.v1,
          certifierCompanyCertificate.v1,
          baseUri,
          this.signers.deployer,
          uupsOpts
        );
        this.contracts.certifierCompany = certifier.proxy as CertifierCompany;
        this.contracts.certifierCompanyCertificate = certifierCertificate.proxy as CertifierCompanyCertificate;
      });

      shouldBehaveLikeInitialize(certifier.id1);
    });
  });
}
