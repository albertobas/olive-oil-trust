import { ICertificates } from 'next-app/src/features/shared/core/entities/Certificates';
import { ITokenTypes } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { getCertificate } from 'next-app/src/features/shared/utils/helpers/certificate';
import { getTokenType } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { ICertificatesByMemberAndAllTokenTypes } from 'next-app/src/features/management/core/entities/MyCertificates';
import { CertificatesByMemberQuery } from 'next-app/.graphclient';

const certificatesByMemberAndAllTokenTypesAdapter = (
  dataRaw: CertificatesByMemberQuery
): ICertificatesByMemberAndAllTokenTypes | null => {
  const { memberContract, tokenTypes } = dataRaw;
  const certificates_: ICertificates = {};
  let tokenTypes_: ITokenTypes | null = null;
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
