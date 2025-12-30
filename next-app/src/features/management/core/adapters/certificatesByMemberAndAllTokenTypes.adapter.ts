import { Certificates } from '@features/shared/core/entities/Certificates';
import { TokenTypes } from '@features/shared/core/entities/TokenTypes';
import { getCertificate } from '@features/shared/utils/helpers/certificate';
import { getTokenType } from '@features/shared/utils/helpers/tokenType';
import { CertificatesByMemberAndAllTokenTypes } from '@features/management/core/entities/MyCertificates';
import { CertificatesByMemberQuery } from '.graphclient';

const certificatesByMemberAndAllTokenTypesAdapter = (
  dataRaw: CertificatesByMemberQuery
): CertificatesByMemberAndAllTokenTypes | null => {
  const { memberContract, tokenTypes } = dataRaw;
  const certificates_: Certificates = {};
  let tokenTypes_: TokenTypes | null = null;
  if (memberContract) {
    for (let i = 0; i < memberContract.asAccount.ownerOfCertificateContract.length; i++) {
      const { certificates } = memberContract.asAccount.ownerOfCertificateContract[i];
      if (certificates && certificates.length > 0) {
        for (let j = 0; j < certificates.length; j++) {
          const certificateRaw = certificates[j];
          certificates_[certificateRaw.id] = getCertificate(certificateRaw);
        }
      }
    }
  }
  if (tokenTypes.length > 0) {
    tokenTypes_ = {};
    for (let i = 0; i < tokenTypes.length; i++) {
      const tokenTypeRaw = tokenTypes[i];
      tokenTypes_[tokenTypeRaw.id] = getTokenType(tokenTypeRaw);
    }
  }

  return { certificates: Object.keys(certificates_).length > 0 ? certificates_ : null, tokenTypes: tokenTypes_ };
};

export default certificatesByMemberAndAllTokenTypesAdapter;
