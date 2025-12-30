import { utils } from 'ethers';
import { dictCertificate, dictOlives } from '@test/shared/constants';
import { baseUri, dictChainActorsNames, dictContracts, uupsOpts } from '@shared/constants';
import shouldBehaveLikeName from '@test/shared/base/BaseMember/view/name';
import { certifiedPicualCertifierFixture, certifierFixture } from '@test/shared/fixtures';
import shouldBehaveLikeCertifyBatch from '@test/roles/CertifierUpgradeable/effects/certifyBatch';
import shouldBehaveLikeCertifyToken from '@test/roles/CertifierUpgradeable/effects/certifyToken';
import shouldUpgrade from '@test/roles/CertifierUpgradeable/effects/upgrade';
import shouldBehaveLikeInitialize from '@test/roles/CertifierUpgradeable/effects/initialize';
import shouldBehaveLikeCertificatesOf from '@test/roles/CertifierUpgradeable/views/certificateOf';
import shouldBehaveLikeCertificatesOfBatch from '@test/roles/CertifierUpgradeable/views/certificatesOfBatch';
import shouldBehaveLikeIsCertified from '@test/roles/CertifierUpgradeable/views/isCertified';

export function shouldBehaveLikeCertifierUpgradeable(): void {
  const certifierName = dictChainActorsNames.certifier.id1;
  const contract = 'certifier';
  const tokenContract = 'olivesToken';
  const idCertificateOlivesHQPicual = utils.formatBytes32String(dictCertificate.olives.hQPicual);
  const idCertificateOlivesMQArbequina = utils.formatBytes32String(dictCertificate.olives.mQArbequina);
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);

  describe('Effects functions', function () {
    describe('#upgrade', function () {
      shouldUpgrade(dictContracts.certifierWithInit.v1, dictContracts.certificateWithInit.v1, baseUri, uupsOpts);
    });

    describe('#initialize', function () {
      beforeEach(async function () {
        const { certifier, certificate } = await this.loadFixture(certifierFixture);
        this.contracts.certifier = certifier;
        this.contracts.certificate = certificate;
      });

      shouldBehaveLikeInitialize(certifierName);
    });

    describe('#certifyToken', function () {
      beforeEach(async function () {
        const { certifier, certificate, olivesToken } = await this.loadFixture(certifierFixture);
        this.contracts.certifier = certifier;
        this.contracts.certificate = certificate;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeCertifyToken(tokenContract, idCertificateOlivesHQPicual, idPicual);
    });

    describe('#certifyBatch', function () {
      beforeEach(async function () {
        const { certifier, certificate, olivesToken } = await this.loadFixture(certifierFixture);
        this.contracts.certifier = certifier;
        this.contracts.certificate = certificate;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeCertifyBatch(
        tokenContract,
        [idCertificateOlivesHQPicual, idCertificateOlivesMQArbequina],
        [idPicual, idArbequina]
      );
    });
  });
  describe('View functions', function () {
    describe('#certificatesOf', function () {
      before(async function () {
        const { certifier, olivesToken } = await this.loadFixture(certifiedPicualCertifierFixture);
        this.contracts.certifier = certifier;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeCertificatesOf(tokenContract, idCertificateOlivesHQPicual, idPicual);
    });

    describe('#certificatesOfBatch', function () {
      before(async function () {
        const { certifier, olivesToken } = await this.loadFixture(certifierFixture);
        this.contracts.certifier = certifier;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeCertificatesOfBatch(
        tokenContract,
        [idCertificateOlivesHQPicual, idCertificateOlivesMQArbequina],
        [idPicual, idArbequina]
      );
    });

    describe('#isCertified', function () {
      before(async function () {
        const { certifier, olivesToken } = await this.loadFixture(certifierFixture);
        this.contracts.certifier = certifier;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeIsCertified(tokenContract, idCertificateOlivesHQPicual, idPicual);
    });

    describe('#name', function () {
      beforeEach(async function () {
        const { certifier } = await this.loadFixture(certifierFixture);
        this.contracts.certifier = certifier;
      });
      shouldBehaveLikeName(contract, certifierName);
    });
  });
}
