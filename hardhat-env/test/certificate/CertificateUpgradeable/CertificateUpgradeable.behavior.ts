import {
  certificateFixture,
  certifiedPicualCertificateFixture,
  olivesCertificateFixture
} from 'hardhat-env/test/shared/fixtures';
import { dictCertificate, dictOlives } from 'hardhat-env/test/shared/constants';
import { utils } from 'ethers';
import shouldBehaveLikeInitialize from 'hardhat-env/test/certificate/CertificateUpgradeable/effects/initialize';
import shouldBehaveLikeCertifyToken from 'hardhat-env/test/certificate/CertificateUpgradeable/effects/certifyToken';
import shouldBehaveLikeCertifyBatch from 'hardhat-env/test/certificate/CertificateUpgradeable/effects/certifyBatch';
import shouldBehaveLikeUri from 'hardhat-env/test/certificate/CertificateUpgradeable/view/uri';
import shouldBehaveLikeIsCertified from 'hardhat-env/test/certificate/CertificateUpgradeable/view/isCertified';
import shouldBehaveLikeCertificatesOf from 'hardhat-env/test/certificate/CertificateUpgradeable/view/certificatesOf';
import shouldBehaveLikeCertificatesOfBatch from 'hardhat-env/test/certificate/CertificateUpgradeable/view/certificatesOfBatch';
import shouldUpgrade from 'hardhat-env/test/certificate/CertificateUpgradeable/effects/upgrade';
import { baseUri } from 'hardhat-env/shared/constants';

export function shouldBehaveLikeCertificateUpgradeable(): void {
  const tokenContract = 'olivesToken';
  const idCertificateOlivesHQPicual = utils.formatBytes32String(dictCertificate.olives.hQPicual);
  const idCertificateOlivesMQArbequina = utils.formatBytes32String(dictCertificate.olives.mQArbequina);
  const idPicual = utils.formatBytes32String(dictOlives.picual.id);
  const idArbequina = utils.formatBytes32String(dictOlives.arbequina.id);

  describe('Effects functions', function () {
    before(async function () {
      const certificate = await this.loadFixture(certificateFixture);
      this.contracts.certificate = certificate;
    });

    describe('#upgrade', function () {
      shouldUpgrade();
    });

    describe('#initialize', function () {
      before(async function () {
        const { certificate } = await this.loadFixture(olivesCertificateFixture);
        this.contracts.certificate = certificate;
      });

      shouldBehaveLikeInitialize(baseUri);
    });

    describe('#certifyToken', function () {
      beforeEach(async function () {
        const { certificate, olivesToken } = await this.loadFixture(olivesCertificateFixture);
        this.contracts.certificate = certificate;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeCertifyToken(tokenContract, idCertificateOlivesHQPicual, idPicual, idArbequina);
    });

    describe('#certifyBatch', function () {
      beforeEach(async function () {
        const { certificate, olivesToken } = await this.loadFixture(olivesCertificateFixture);
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
        const { certificate, olivesToken } = await this.loadFixture(certifiedPicualCertificateFixture);
        this.contracts.certificate = certificate;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeCertificatesOf(tokenContract, idCertificateOlivesHQPicual, idPicual);
    });

    describe('#certificatesOfBatch', function () {
      before(async function () {
        const { certificate, olivesToken } = await this.loadFixture(olivesCertificateFixture);
        this.contracts.certificate = certificate;
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
        const { certificate, olivesToken } = await this.loadFixture(olivesCertificateFixture);
        this.contracts.certificate = certificate;
        this.contracts.olivesToken = olivesToken;
      });

      shouldBehaveLikeIsCertified(tokenContract, idCertificateOlivesHQPicual, idPicual);
    });

    describe('#uri', function () {
      before(async function () {
        const { certificate } = await this.loadFixture(olivesCertificateFixture);
        this.contracts.certificate = certificate;
      });

      shouldBehaveLikeUri(baseUri);
    });
  });
}
