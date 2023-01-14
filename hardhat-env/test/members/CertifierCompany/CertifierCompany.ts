import { shouldBehaveLikeCertifierCompany } from 'hardhat-env/test/members/CertifierCompany/CertifierCompany.behavior';
import { dictContracts } from 'hardhat-env/shared/constants';

export function testCertifierCompany(): void {
  describe(dictContracts.certifierCompany.v1, function () {
    shouldBehaveLikeCertifierCompany();
  });
}
