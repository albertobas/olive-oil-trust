import { shouldBehaveLikeCertifierCompany } from '@test/members/CertifierCompany/CertifierCompany.behavior';
import { dictContracts } from '@shared/constants';

export function testCertifierCompany(): void {
  describe(dictContracts.certifierCompany.v1, function () {
    shouldBehaveLikeCertifierCompany();
  });
}
